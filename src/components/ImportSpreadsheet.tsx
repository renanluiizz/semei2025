
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportSpreadsheetProps {
  open: boolean;
  onClose: () => void;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; message: string; data?: any }>;
  duplicates: number;
}

export function ImportSpreadsheet({ open, onClose }: ImportSpreadsheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredFields = [
    'Nome',
    'CPF',
    'Data de Nascimento',
    'Endereço',
    'Telefone',
    'Responsável',
    'Tipo de Atividade'
  ];

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11 && /^\d{11}$/.test(cleanCPF);
  };

  const validateDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date < new Date();
  };

  const processSpreadsheet = async (file: File) => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        toast.error('Planilha deve conter pelo menos uma linha de cabeçalho e uma de dados');
        setIsProcessing(false);
        return;
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];

      // Verificar se todos os campos obrigatórios estão presentes
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      if (missingFields.length > 0) {
        toast.error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      const result: ImportResult = {
        success: 0,
        errors: [],
        duplicates: 0
      };

      const existingCPFs = new Set<string>(); // Simular verificação de CPFs existentes

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData: any = {};
        
        // Mapear dados da linha
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });

        const rowNumber = i + 2; // +2 porque começamos da linha 1 e pulamos o cabeçalho

        // Validações
        const errors: string[] = [];

        // Verificar campos obrigatórios
        requiredFields.forEach(field => {
          if (!rowData[field] || rowData[field].toString().trim() === '') {
            errors.push(`Campo "${field}" é obrigatório`);
          }
        });

        // Validar CPF
        if (rowData['CPF'] && !validateCPF(rowData['CPF'])) {
          errors.push('CPF inválido');
        }

        // Verificar duplicata de CPF
        const cpf = rowData['CPF']?.replace(/[^\d]/g, '');
        if (cpf && existingCPFs.has(cpf)) {
          errors.push('CPF já existe no sistema');
          result.duplicates++;
        } else if (cpf) {
          existingCPFs.add(cpf);
        }

        // Validar data de nascimento
        if (rowData['Data de Nascimento'] && !validateDate(rowData['Data de Nascimento'])) {
          errors.push('Data de nascimento inválida');
        }

        if (errors.length > 0) {
          result.errors.push({
            row: rowNumber,
            message: errors.join('; '),
            data: rowData
          });
        } else {
          // Simular inserção no banco de dados
          console.log('Dados válidos para inserção:', rowData);
          result.success++;
        }
      }

      setImportResult(result);

      if (result.success > 0) {
        toast.success(`Importação concluída! ${result.success} registros importados com sucesso.`);
      }

      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} registros com erro foram ignorados.`);
      }

    } catch (error) {
      console.error('Erro ao processar planilha:', error);
      toast.error('Erro ao processar arquivo. Verifique se é um arquivo Excel válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar extensão do arquivo
    const validExtensions = ['.xlsx', '.xlsm', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Arquivo deve ser um Excel (.xlsx, .xlsm ou .xls)');
      return;
    }

    processSpreadsheet(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      requiredFields,
      [
        'João Silva',
        '123.456.789-00',
        '1950-01-15',
        'Rua das Flores, 123',
        '(21) 99999-9999',
        'Maria Silva',
        'Fisioterapia'
      ],
      [
        'Maria Santos',
        '987.654.321-00',
        '1945-03-20',
        'Av. Principal, 456',
        '(21) 88888-8888',
        'João Santos',
        'Bingo'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    
    // Configurar largura das colunas
    ws['!cols'] = requiredFields.map(() => ({ wch: 20 }));
    
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
    XLSX.writeFile(wb, 'modelo_importacao_semei.xlsx');
    
    toast.success('Modelo de planilha baixado com sucesso!');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto semei-card">
        <CardHeader className="semei-header text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileSpreadsheet className="h-6 w-6" />
              Importar Planilha de Idosos
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Instruções */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
            <h3 className="font-semibold text-primary mb-2">📋 Instruções para Importação</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• A planilha deve conter os seguintes campos obrigatórios:</p>
              <div className="grid grid-cols-2 gap-2 ml-4 mt-2">
                {requiredFields.map(field => (
                  <span key={field} className="text-xs bg-white px-2 py-1 rounded border">
                    {field}
                  </span>
                ))}
              </div>
              <p className="mt-3">• Formatos aceitos: .xlsx, .xlsm, .xls</p>
              <p>• CPF deve estar no formato: 123.456.789-00</p>
              <p>• Data de nascimento: DD/MM/AAAA ou AAAA-MM-DD</p>
            </div>
          </div>

          {/* Download do modelo */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Baixar Modelo de Planilha</h4>
              <p className="text-sm text-blue-700">Use nosso modelo para garantir a formatação correta</p>
            </div>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Baixar Modelo
            </Button>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-4">
            <Label htmlFor="file-upload" className="text-sm font-medium">Selecionar Arquivo</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p className="text-sm text-gray-500">
                Suporta arquivos Excel (.xlsx, .xlsm, .xls)
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xlsm,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Processamento */}
          {isProcessing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-primary">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="font-medium">Processando planilha...</span>
              </div>
            </div>
          )}

          {/* Resultado da importação */}
          {importResult && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resultado da Importação</h3>
              
              {/* Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                      <p className="text-sm text-green-700">Registros importados</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                      <p className="text-sm text-red-700">Registros com erro</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</p>
                      <p className="text-sm text-yellow-700">CPFs duplicados</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes dos erros */}
              {importResult.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 max-h-60 overflow-y-auto">
                  <h4 className="font-medium text-red-900 mb-3">Detalhes dos Erros:</h4>
                  <div className="space-y-2">
                    {importResult.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-red-800">Linha {error.row}:</span>
                        <span className="text-red-700 ml-2">{error.message}</span>
                      </div>
                    ))}
                    {importResult.errors.length > 10 && (
                      <p className="text-sm text-red-600 italic">
                        ... e mais {importResult.errors.length - 10} erros
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
