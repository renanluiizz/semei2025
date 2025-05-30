
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Download, Filter, Calendar, Users, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportGeneratorProps {
  open?: boolean;
  onClose?: () => void;
}

interface Activity {
  id: string;
  data_atividade: string;
  tipo_atividade: string;
  observacoes: string;
  idoso_id: string;
  idoso?: {
    id: string;
    nome: string;
    sexo: string;
  };
}

interface Idoso {
  id: string;
  nome: string;
  sexo: string;
}

interface ActivityTypeStats {
  [activityType: string]: number;
}

interface GenderStats {
  [gender: string]: number;
}

export function ReportGenerator({ open, onClose }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activityType, setActivityType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { data: activitiesData, isLoading, error, refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: () => dbHelpers.getAtividades(),
    retry: 3,
    staleTime: 0, // Sempre buscar dados frescos
  });

  // Validação e extração segura dos dados
  const activities: Activity[] = Array.isArray(activitiesData?.data) ? activitiesData.data : [];

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar a data:', error);
      return '';
    }
  };

  const validateDateRange = (): boolean => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        toast.error('A data de início deve ser anterior à data de fim');
        return false;
      }
    }
    return true;
  };

  const filteredActivities = activities.filter((atividade) => {
    if (!validateDateRange()) return false;
    
    const activityDate = new Date(atividade.data_atividade);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && activityDate < start) return false;
    if (end && activityDate > end) return false;
    if (activityType !== 'all' && atividade.tipo_atividade !== activityType) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = atividade.idoso?.nome?.toLowerCase().includes(searchLower);
      const matchesType = atividade.tipo_atividade?.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesType) return false;
    }
    
    return true;
  });

  const filteredIdosos: Idoso[] = filteredActivities.reduce((uniqueIdosos: Idoso[], atividade) => {
    if (atividade.idoso && !uniqueIdosos.find(idoso => idoso.id === atividade.idoso!.id)) {
      uniqueIdosos.push(atividade.idoso);
    }
    return uniqueIdosos;
  }, []);

  const activityTypeStats: ActivityTypeStats = filteredActivities.reduce((stats: ActivityTypeStats, atividade) => {
    const type = atividade.tipo_atividade || 'Sem tipo';
    stats[type] = (stats[type] || 0) + 1;
    return stats;
  }, {});

  const genderStats: GenderStats = filteredIdosos.reduce((stats: GenderStats, idoso) => {
    const gender = idoso.sexo || 'Não informado';
    stats[gender] = (stats[gender] || 0) + 1;
    return stats;
  }, {});

  const generateXLSX = async () => {
    if (!filteredActivities || filteredActivities.length === 0) {
      toast.error('Nenhuma atividade encontrada para exportar');
      return;
    }

    setIsGenerating(true);
    
    try {
      const data = filteredActivities.map((atividade) => ({
        Data: format(new Date(atividade.data_atividade), 'dd/MM/yyyy', { locale: ptBR }),
        Tipo: atividade.tipo_atividade || 'N/A',
        Participante: atividade.idoso?.nome || 'N/A',
        Observações: atividade.observacoes || 'N/A',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Atividades');
      
      const fileName = `relatorio_atividades_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Relatório XLSX gerado com sucesso!', {
        description: `Arquivo: ${fileName}`
      });
    } catch (error) {
      console.error('Erro ao gerar XLSX:', error);
      toast.error('Erro ao gerar relatório XLSX');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
    if (!filteredActivities || filteredActivities.length === 0) {
      toast.error('Nenhuma atividade encontrada para exportar');
      return;
    }

    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const margin = 20;
      let yPosition = margin;
      
      // Header melhorado
      doc.setFontSize(20);
      doc.setTextColor(88, 28, 135);
      doc.text('SEMEI - Secretaria da Melhor Idade', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Relatório de Atividades', margin, yPosition);
      yPosition += 15;
      
      // Informações do filtro
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      
      if (startDate || endDate) {
        doc.text(`Período: ${startDate || 'Início'} até ${endDate || 'Fim'}`, margin, yPosition);
        yPosition += 6;
      }
      
      if (activityType !== 'all') {
        doc.text(`Tipo de Atividade: ${activityType}`, margin, yPosition);
        yPosition += 6;
      }
      
      if (searchTerm) {
        doc.text(`Busca: ${searchTerm}`, margin, yPosition);
        yPosition += 6;
      }
      
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, margin, yPosition);
      yPosition += 15;
      
      // Resumo estatístico
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumo Estatístico:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.text(`• Total de atividades: ${filteredActivities.length}`, margin + 10, yPosition);
      yPosition += 5;
      doc.text(`• Participantes únicos: ${filteredIdosos.length}`, margin + 10, yPosition);
      yPosition += 10;
      
      // Estatísticas por tipo
      if (Object.keys(activityTypeStats).length > 0) {
        doc.text('• Distribuição por tipo de atividade:', margin + 10, yPosition);
        yPosition += 5;
        
        Object.entries(activityTypeStats).forEach(([type, count]) => {
          const percentage = ((count / filteredActivities.length) * 100).toFixed(1);
          doc.text(`  - ${type}: ${count} (${percentage}%)`, margin + 15, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }
      
      // Tabela de atividades
      if (filteredActivities.length > 0) {
        doc.setFontSize(14);
        doc.text('Detalhamento das Atividades:', margin, yPosition);
        yPosition += 10;
        
        const tableData = filteredActivities.slice(0, 100).map((atividade) => [
          format(new Date(atividade.data_atividade), 'dd/MM/yyyy', { locale: ptBR }),
          atividade.tipo_atividade || 'N/A',
          atividade.idoso?.nome || 'N/A',
          (atividade.observacoes?.substring(0, 40) + (atividade.observacoes?.length > 40 ? '...' : '')) || 'N/A'
        ]);
        
        (doc as any).autoTable({
          head: [['Data', 'Tipo', 'Participante', 'Observações']],
          body: tableData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [88, 28, 135], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        if (filteredActivities.length > 100) {
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Exibindo primeiras 100 atividades de ${filteredActivities.length} total.`, margin, finalY);
        }
      }
      
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('SEMEI - Sistema de Gestão da Melhor Idade', margin, pageHeight - 15);
      doc.text(`Página 1 de 1 - ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, margin, pageHeight - 10);
      
      const fileName = `relatorio_atividades_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
      doc.save(fileName);
      
      toast.success('Relatório PDF gerado com sucesso!', {
        description: `Arquivo: ${fileName}`
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Dados atualizados com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">Erro ao carregar atividades</p>
          <p className="text-gray-500 text-sm mb-4">Tente recarregar a página</p>
          <Button onClick={handleRefresh} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Relatórios
        </CardTitle>
        <CardDescription>
          Filtre e gere relatórios detalhados das atividades realizadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data de Fim</Label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              max={formatDate(new Date().toISOString())}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="activityType">Tipo de Atividade</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {activities && [...new Set(activities.map((atividade) => atividade.tipo_atividade))].filter(Boolean).map(
                  (type, index) => (
                    <SelectItem key={index} value={type || ''}>
                      {type}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="searchTerm">Buscar por Nome/Tipo</Label>
          <div className="relative">
            <Input
              type="search"
              id="searchTerm"
              placeholder="Digite para buscar..."
              className="rounded-xl pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <Separator />

        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                <Calendar className="h-4 w-4" />
                Atividades Encontradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-700">{filteredActivities.length}</span>
                <span className="text-sm text-blue-600">atividades</span>
                {filteredActivities.length > 0 && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-green-700">
                <Users className="h-4 w-4" />
                Participantes Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-700">{filteredIdosos.length}</span>
                <span className="text-sm text-green-600">idosos</span>
                {filteredIdosos.length > 0 && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Por Tipo de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.keys(activityTypeStats).length > 0 ? (
                  Object.entries(activityTypeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">{type}:</span>
                      <Badge variant="outline" className="rounded-full ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-600" />
                Por Gênero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.keys(genderStats).length > 0 ? (
                  Object.entries(genderStats).map(([gender, count]) => (
                    <div key={gender} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">{gender}:</span>
                      <Badge variant="outline" className="rounded-full ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Atualizar Dados
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl" 
              onClick={generateXLSX}
              disabled={isGenerating || filteredActivities.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Exportar XLSX'}
            </Button>
            <Button 
              className="semei-button rounded-xl bg-gradient-to-r from-primary to-secondary text-white" 
              onClick={generatePDF}
              disabled={isGenerating || filteredActivities.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar PDF'}
            </Button>
          </div>
        </div>

        {filteredActivities.length === 0 && !isLoading && (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Nenhuma atividade encontrada</p>
            <p className="text-gray-500 text-sm mt-1">
              Ajuste os filtros para encontrar atividades
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
