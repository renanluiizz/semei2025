
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
import { FileText, Download, Filter, Calendar, Users, BarChart3 } from 'lucide-react';
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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: activitiesData, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: () => dbHelpers.getAtividades(),
  });

  // Extract activities array from the response data
  const activities: Activity[] = activitiesData?.data || [];

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar a data:', error);
      return '';
    }
  };

  const filteredActivities = activities.filter((atividade) => {
    const activityDate = new Date(atividade.data_atividade);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && activityDate < start) {
      return false;
    }
    if (end && activityDate > end) {
      return false;
    }
    if (activityType !== 'all' && atividade.tipo_atividade !== activityType) {
      return false;
    }
    if (searchTerm && !atividade.idoso?.nome.toLowerCase().includes(searchTerm.toLowerCase()) && !atividade.tipo_atividade.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
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

  const generateXLSX = () => {
    if (!filteredActivities || filteredActivities.length === 0) {
      toast.error('Nenhuma atividade para exportar.');
      return;
    }

    const data = filteredActivities.map((atividade) => ({
      Data: format(new Date(atividade.data_atividade), 'dd/MM/yyyy', { locale: ptBR }),
      Tipo: atividade.tipo_atividade || 'N/A',
      Participante: atividade.idoso?.nome || 'N/A',
      Observações: atividade.observacoes || 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Atividades');
    XLSX.writeFile(wb, `relatorio_atividades_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
    toast.success('Relatório XLSX gerado com sucesso!');
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const margin = 20;
      let yPosition = margin;
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(88, 28, 135); // Primary color
      doc.text('SEMEI - Secretaria da Melhor Idade', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Relatório de Atividades', margin, yPosition);
      yPosition += 15;
      
      // Filters info
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${startDate || 'Início'} até ${endDate || 'Fim'}`, margin, yPosition);
      yPosition += 6;
      
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
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumo:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.text(`• Total de atividades: ${filteredActivities.length}`, margin + 10, yPosition);
      yPosition += 5;
      doc.text(`• Participantes únicos: ${filteredIdosos.length}`, margin + 10, yPosition);
      yPosition += 5;
      
      // Activity types summary
      if (activityTypeStats && Object.keys(activityTypeStats).length > 0) {
        doc.text('• Distribuição por tipo de atividade:', margin + 10, yPosition);
        yPosition += 5;
        
        Object.entries(activityTypeStats).forEach(([type, count]) => {
          const numericCount = Number(count) || 0;
          const percentage = filteredActivities.length > 0 
            ? ((numericCount / filteredActivities.length) * 100).toFixed(1)
            : '0.0';
          doc.text(`  - ${type}: ${numericCount} (${percentage}%)`, margin + 15, yPosition);
          yPosition += 5;
        });
      }
      
      // Gender statistics
      if (genderStats && Object.keys(genderStats).length > 0) {
        doc.text('• Distribuição por gênero:', margin + 10, yPosition);
        yPosition += 5;
        
        Object.entries(genderStats).forEach(([gender, count]) => {
          const numericCount = Number(count) || 0;
          const percentage = filteredIdosos.length > 0 
            ? ((numericCount / filteredIdosos.length) * 100).toFixed(1)
            : '0.0';
          doc.text(`  - ${gender}: ${numericCount} (${percentage}%)`, margin + 15, yPosition);
          yPosition += 5;
        });
      }
      
      yPosition += 10;
      
      // Activities table
      if (filteredActivities.length > 0) {
        doc.setFontSize(14);
        doc.text('Detalhamento das Atividades:', margin, yPosition);
        yPosition += 10;
        
        const tableData = filteredActivities.slice(0, 50).map((atividade: any) => [
          format(new Date(atividade.data_atividade), 'dd/MM/yyyy', { locale: ptBR }),
          atividade.tipo_atividade || 'N/A',
          atividade.idoso?.nome || 'N/A',
          atividade.observacoes?.substring(0, 30) + (atividade.observacoes?.length > 30 ? '...' : '') || 'N/A'
        ]);
        
        (doc as any).autoTable({
          head: [['Data', 'Tipo', 'Participante', 'Observações']],
          body: tableData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          styles: { fontSize: 9 },
          headStyles: { fillColor: [88, 28, 135] },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        if (filteredActivities.length > 50) {
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Exibindo primeiras 50 atividades de ${filteredActivities.length} total.`, margin, finalY);
        }
      }
      
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('SEMEI - Sistema de Gestão da Melhor Idade', margin, pageHeight - 15);
      doc.text(`Página 1 de 1 - ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, margin, pageHeight - 10);
      
      doc.save(`relatorio_atividades_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
      toast.success('Relatório PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF. Tente novamente.');
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando atividades...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar atividades.</div>;
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
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              type="date"
              id="startDate"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || ''}
              placeholder="Data de início"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data de Fim</Label>
            <Input
              type="date"
              id="endDate"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || ''}
              max={formatDate(new Date().toISOString())}
              placeholder="Data de fim"
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
                {activities && [...new Set(activities.map((atividade) => atividade.tipo_atividade))].map(
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Atividades Encontradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="w-full rounded-xl text-base font-medium p-4">
                {filteredActivities.length} atividades
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Participantes Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="w-full rounded-xl text-base font-medium p-4">
                {filteredIdosos.length} idosos
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                Estatísticas por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(activityTypeStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span>{type}:</span>
                  <Badge variant="outline" className="rounded-xl">
                    {count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                Estatísticas por Gênero
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(genderStats).map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between text-sm">
                  <span>{gender}:</span>
                  <Badge variant="outline" className="rounded-xl">
                    {count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl" onClick={generateXLSX}>
            <Download className="h-4 w-4 mr-2" />
            Exportar XLSX
          </Button>
          <Button className="semei-button rounded-xl bg-gradient-to-r from-primary to-secondary text-white" onClick={generatePDF}>
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
