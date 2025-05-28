
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

interface ExportOptionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  isGenerating: boolean;
}

export function ExportOptions({ onExportPDF, onExportExcel, onExportCSV, isGenerating }: ExportOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Opções de Exportação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onExportPDF} 
          disabled={isGenerating}
          className="w-full justify-start"
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
        
        <Button 
          onClick={onExportExcel} 
          disabled={isGenerating}
          className="w-full justify-start"
          variant="outline"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar Excel (.xlsx)
        </Button>
        
        <Button 
          onClick={onExportCSV} 
          disabled={isGenerating}
          className="w-full justify-start"
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </CardContent>
    </Card>
  );
}
