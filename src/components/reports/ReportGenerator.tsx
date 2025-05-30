import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, FileText, Calendar, X, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportGeneratorProps {
  open: boolean;
  onClose: () => void;
}

export function ReportGenerator({ open, onClose }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedElder, setSelectedElder] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: idosos } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const { data: atividades } = useQuery({
    queryKey: ['atividades'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAtividades();
      if (error) throw error;
      return data;
    },
  });

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast.error('Nenhum dado encontrado para exportar');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToExcel = (data: any[], filename: string) => {
    if (!data.length) {
      toast.error('Nenhum dado encontrado para exportar');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      
      // Configurar largura das colunas
      const colWidths = Object.keys(data[0]).map(() => ({ wch: 20 }));
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
      XLSX.writeFile(wb, `${filename}.xlsx`);
      
      toast.success('Arquivo Excel exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast.error('Erro ao exportar arquivo Excel');
    }
  };

  const generatePDF = async () => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      
      // Cabeçalho institucional melhorado
      doc.setFontSize(18);
      doc.setTextColor(127, 63, 191); // Cor lilás institucional
      doc.text('Secretaria da Melhor Idade - SEMEI', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139);
      doc.text('Sistema de Gestão Institucional', pageWidth / 2, 35, { align: 'center' });
      
      // Linha decorativa
      doc.setDrawColor(127, 63, 191);
      doc.setLineWidth(0.5);
      doc.line(margin, 40, pageWidth - margin, 40);
      
      // Informações do relatório
      doc.setFontSize(12);
      doc.setTextColor(64, 64, 64);
      doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`, margin, 55);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, margin, 63);

      let yPosition = 80;

      if (reportType === 'idosos') {
        // Relatório de Idosos
        doc.setFontSize(16);
        doc.setTextColor(127, 63, 191);
        doc.text('Relatório de Idosos Cadastrados', margin, yPosition);
        yPosition += 15;

        const filteredIdosos = idosos?.filter(idoso => {
          const registrationDate = new Date(idoso.registration_date || idoso.created_at);
          return registrationDate >= new Date(startDate) && registrationDate <= new Date(endDate);
        }) || [];

        if (filteredIdosos.length === 0) {
          doc.setTextColor(100, 116, 139);
          doc.text('Nenhum idoso encontrado no período selecionado.', margin, yPosition);
        } else {
          const tableData = filteredIdosos.map(idoso => [
            idoso.name,
            new Date(idoso.birth_date).toLocaleDateString('pt-BR'),
            `${idoso.age || 0} anos`,
            idoso.gender,
            idoso.cpf,
            new Date(idoso.registration_date || idoso.created_at).toLocaleDateString('pt-BR')
          ]);

          (doc as any).autoTable({
            head: [['Nome', 'Data Nasc.', 'Idade', 'Gênero', 'CPF', 'Data Cadastro']],
            body: tableData,
            startY: yPosition,
            theme: 'striped',
            styles: { 
              fontSize: 8,
              cellPadding: 3,
              textColor: [64, 64, 64]
            },
            headStyles: { 
              fillColor: [127, 63, 191],
              textColor: [255, 255, 255],
              fontSize: 9,
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });

          yPosition = (doc as any).lastAutoTable.finalY + 20;
          
          // Estatísticas
          doc.setFontSize(14);
          doc.setTextColor(127, 63, 191);
          doc.text('Estatísticas do Período', margin, yPosition);
          yPosition += 10;

          doc.setFontSize(11);
          doc.setTextColor(64, 64, 64);
          doc.text(`Total de idosos cadastrados: ${filteredIdosos.length}`, margin, yPosition);
          yPosition += 7;

          const genderStats = filteredIdosos.reduce((acc, idoso) => {
            acc[idoso.gender] = (acc[idoso.gender] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          doc.text('Distribuição por Gênero:', margin, yPosition);
          yPosition += 5;
          
          Object.entries(genderStats).forEach(([gender, count]) => {
            const percentage = ((count / filteredIdosos.length) * 100).toFixed(1);
            doc.text(`• ${gender}: ${count} (${percentage}%)`, margin + 10, yPosition);
            yPosition += 5;
          });
        }
      } else if (reportType === 'atividades') {
        // Relatório de Atividades
        doc.setFontSize(16);
        doc.setTextColor(127, 63, 191);
        doc.text('Relatório de Atividades', margin, yPosition);
        yPosition += 15;

        let filteredAtividades = atividades?.filter(atividade => {
          const activityDate = new Date(atividade.check_in_time);
          const inDateRange = activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
          if (selectedElder) {
            return inDateRange && atividade.elder_id === selectedElder;
          }
          return inDateRange;
        }) || [];

        if (filteredAtividades.length === 0) {
          doc.setTextColor(100, 116, 139);
          doc.text('Nenhuma atividade encontrada no período selecionado.', margin, yPosition);
        } else {
          const tableData = filteredAtividades.map(atividade => [
            atividade.elder?.name || 'N/A',
            atividade.activity_type,
            new Date(atividade.check_in_time).toLocaleDateString('pt-BR'),
            new Date(atividade.check_in_time).toLocaleTimeString('pt-BR'),
            atividade.staff?.full_name || 'N/A',
            (atividade.observation || '-').substring(0, 30) + (atividade.observation && atividade.observation.length > 30 ? '...' : '')
          ]);

          (doc as any).autoTable({
            head: [['Idoso', 'Atividade', 'Data', 'Hora', 'Responsável', 'Observações']],
            body: tableData,
            startY: yPosition,
            theme: 'striped',
            styles: { 
              fontSize: 7,
              cellPadding: 2,
              textColor: [64, 64, 64]
            },
            headStyles: { 
              fillColor: [127, 63, 191],
              textColor: [255, 255, 255],
              fontSize: 8,
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });

          yPosition = (doc as any).lastAutoTable.finalY + 20;

          // Estatísticas de atividades
          doc.setFontSize(14);
          doc.setTextColor(127, 63, 191);
          doc.text('Estatísticas do Período', margin, yPosition);
          yPosition += 10;

          doc.setFontSize(11);
          doc.setTextColor(64, 64, 64);
          doc.text(`Total de atividades: ${filteredAtividades.length}`, margin, yPosition);
          yPosition += 7;

          const activityStats = filteredAtividades.reduce((acc, atividade) => {
            acc[atividade.activity_type] = (acc[atividade.activity_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          doc.text('Por Tipo de Atividade:', margin, yPosition);
          yPosition += 5;

          Object.entries(activityStats)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .forEach(([tipo, quantidade]) => {
              doc.text(`• ${tipo}: ${quantidade} atividades`, margin + 10, yPosition);
              yPosition += 5;
            });
        }
      }

      // Rodapé institucional
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, doc.internal.pageSize.height - 15, { align: 'right' });
        doc.text('Secretaria da Melhor Idade - SEMEI', margin, doc.internal.pageSize.height - 15);
        doc.text('Sistema de Gestão Institucional', margin, doc.internal.pageSize.height - 10);
      }

      const fileName = `relatorio_${reportType}_${startDate}_${endDate}${selectedElder ? '_' + selectedElder : ''}.pdf`;
      doc.save(fileName);

      toast.success('Relatório PDF gerado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório PDF. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = (format: 'csv' | 'excel') => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    let data: any[] = [];
    let filename = '';

    if (reportType === 'idosos') {
      const filteredIdosos = idosos?.filter(idoso => {
        const registrationDate = new Date(idoso.registration_date || idoso.created_at);
        return registrationDate >= new Date(startDate) && registrationDate <= new Date(endDate);
      }) || [];

      data = filteredIdosos.map(idoso => ({
        Nome: idoso.name,
        'Data Nascimento': new Date(idoso.birth_date).toLocaleDateString('pt-BR'),
        Idade: `${idoso.age || 0} anos`,
        Gênero: idoso.gender,
        CPF: idoso.cpf,
        Telefone: idoso.phone || '-',
        Endereço: idoso.address || '-',
        'Data Cadastro': new Date(idoso.registration_date || idoso.created_at).toLocaleDateString('pt-BR')
      }));
      filename = `idosos_${startDate}_${endDate}`;
    } else if (reportType === 'atividades') {
      let filteredAtividades = atividades?.filter(atividade => {
        const activityDate = new Date(atividade.check_in_time);
        const inDateRange = activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
        if (selectedElder) {
          return inDateRange && atividade.elder_id === selectedElder;
        }
        return inDateRange;
      }) || [];

      data = filteredAtividades.map(atividade => ({
        Idoso: atividade.elder?.name || 'N/A',
        Atividade: atividade.activity_type,
        Data: new Date(atividade.check_in_time).toLocaleDateString('pt-BR'),
        Hora: new Date(atividade.check_in_time).toLocaleTimeString('pt-BR'),
        Responsável: atividade.staff?.full_name || 'N/A',
        Observações: atividade.observation || '-'
      }));
      filename = `atividades_${startDate}_${endDate}`;
    }

    if (format === 'csv') {
      exportToCSV(data, filename);
    } else {
      exportToExcel(data, filename);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto semei-card">
        <CardHeader className="semei-header text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-6 w-6" />
              Gerador de Relatórios
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType" className="text-sm font-medium">Tipo de Relatório *</Label>
              <Select onValueChange={setReportType}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idosos">
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>Relatório de Idosos</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="atividades">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>Relatório de Atividades</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">Data Inicial *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-medium">Data Final *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {reportType === 'atividades' && (
              <div>
                <Label htmlFor="selectedElder" className="text-sm font-medium">
                  <Filter className="h-4 w-4 inline mr-1" />
                  Filtrar por Idoso (opcional)
                </Label>
                <Select onValueChange={setSelectedElder}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Todos os idosos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os idosos</SelectItem>
                    {idosos?.map((idoso) => (
                      <SelectItem key={idoso.id} value={idoso.id}>
                        {idoso.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Formatos de Exportação */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
              <Download className="h-5 w-5" />
              Formatos de Exportação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                onClick={generatePDF} 
                disabled={isGenerating}
                className="semei-button bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Gerando...' : 'Exportar PDF'}
              </Button>
              
              <Button 
                onClick={() => handleExportData('excel')} 
                disabled={isGenerating}
                variant="outline"
                className="rounded-xl border-primary/20 hover:bg-primary/5"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
              
              <Button 
                onClick={() => handleExportData('csv')} 
                disabled={isGenerating}
                variant="outline"
                className="rounded-xl border-secondary/20 hover:bg-secondary/5"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
