
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { QrCode, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  data?: {
    type: string;
    timestamp: number;
    location: string;
  };
}

export function QRCodeGenerator({ data }: QRCodeGeneratorProps) {
  const [selectedElder, setSelectedElder] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  const { data: idosos } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const generateQRCode = () => {
    if (!selectedElder) return;
    
    const elder = idosos?.find(i => i.id === selectedElder);
    if (!elder) return;

    // Use the passed data if available, otherwise create default data
    const qrData = data || {
      type: 'checkin',
      timestamp: Date.now(),
      location: window.location.origin
    };

    // Dados para o QR Code (URL que direciona para check-in automático)
    const checkInUrl = `${qrData.location}/checkin?elder=${selectedElder}&name=${encodeURIComponent(elder.name)}&type=${qrData.type}&timestamp=${qrData.timestamp}`;
    setQrCodeData(checkInUrl);
  };

  const downloadQRCode = () => {
    if (!qrCodeData || !selectedElder) return;
    
    const elder = idosos?.find(i => i.id === selectedElder);
    if (!elder) return;

    // Criar canvas para QR Code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 250;
    
    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texto do idoso
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(elder.name, canvas.width / 2, 20);
    
    // Simular QR Code (em produção, usar biblioteca como qrcode.js)
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(50 + i * 10, 40 + j * 10, 10, 10);
        }
      }
    }
    
    ctx.font = '12px Arial';
    ctx.fillText('QR Code Check-in', canvas.width / 2, 180);
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 200);

    // Download
    const link = document.createElement('a');
    link.download = `qr-code-${elder.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Gerador de QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select onValueChange={setSelectedElder}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um idoso" />
            </SelectTrigger>
            <SelectContent>
              {idosos?.map((idoso) => (
                <SelectItem key={idoso.id} value={idoso.id}>
                  {idoso.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={generateQRCode} disabled={!selectedElder} className="w-full">
          Gerar QR Code
        </Button>

        {qrCodeData && (
          <div className="text-center space-y-3">
            <div className="bg-gray-100 p-4 rounded border-2 border-dashed">
              <div className="text-sm text-gray-600 mb-2">QR Code gerado!</div>
              <div className="text-xs text-gray-500 break-all">{qrCodeData}</div>
            </div>
            <Button onClick={downloadQRCode} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
