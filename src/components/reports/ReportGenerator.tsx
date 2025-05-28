
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, FileText, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportGeneratorProps {
  open: boolean;
  onClose: () => void;
}

export function ReportGenerator({ open, onClose }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const generatePDF = async () => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text('Relatório do Sistema de Gestão de Idosos', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' });
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, 37, { align: 'center' });

      let yPosition = 50;

      if (reportType === 'idosos') {
        // Relatório de Idosos
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Relatório de Idosos Cadastrados', 20, yPosition);
        yPosition += 10;

        const filteredIdosos = idosos?.filter(idoso => {
          const registrationDate = new Date(idoso.registration_date || idoso.created_at);
          return registrationDate >= new Date(startDate) && registrationDate <= new Date(endDate);
        }) || [];

        const tableData = filteredIdosos.map(idoso => [
          idoso.name,
          new Date(idoso.birth_date).toLocaleDateString('pt-BR'),
          idoso.gender,
          idoso.cpf,
          new Date(idoso.registration_date || idoso.created_at).toLocaleDateString('pt-BR')
        ]);

        (doc as any).autoTable({
          head: [['Nome', 'Data Nascimento', 'Gênero', 'CPF', 'Data Cadastro']],
          body: tableData,
          startY: yPosition,
          theme: 'striped',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
        doc.text(`Total de idosos no período: ${filteredIdosos.length}`, 20, yPosition);

      } else if (reportType === 'atividades') {
        // Relatório de Atividades
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Relatório de Atividades', 20, yPosition);
        yPosition += 10;

        const filteredAtividades = atividades?.filter(atividade => {
          const activityDate = new Date(atividade.check_in_time);
          return activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
        }) || [];

        const tableData = filteredAtividades.map(atividade => [
          atividade.elder?.name || 'N/A',
          atividade.activity_type,
          new Date(atividade.check_in_time).toLocaleDateString('pt-BR'),
          new Date(atividade.check_in_time).toLocaleTimeString('pt-BR'),
          atividade.observation || '-'
        ]);

        (doc as any).autoTable({
          head: [['Idoso', 'Tipo Atividade', 'Data', 'Hora', 'Observações']],
          body: tableData,
          startY: yPosition,
          theme: 'striped',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 20;
        doc.text(`Total de atividades no período: ${filteredAtividades.length}`, 20, yPosition);

        // Estatísticas por tipo de atividade
        const activityStats = filteredAtividades.reduce((acc, atividade) => {
          acc[atividade.activity_type] = (acc[atividade.activity_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        yPosition += 10;
        doc.text('Estatísticas por Tipo de Atividade:', 20, yPosition);
        yPosition += 7;

        Object.entries(activityStats).forEach(([tipo, quantidade]) => {
          doc.text(`${tipo}: ${quantidade}`, 25, yPosition);
          yPosition += 5;
        });
      }

      // Footer - Fix the TypeScript error by using a type assertion
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
      }

      const fileName = `relatorio_${reportType}_${startDate}_${endDate}.pdf`;
      doc.save(fileName);

      toast.success('Relatório gerado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reportType">Tipo de Relatório *</Label>
            <Select onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idosos">Relatório de Idosos</SelectItem>
                <SelectItem value="atividades">Relatório de Atividades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Data Inicial *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Data Final *</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={generatePDF} 
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
