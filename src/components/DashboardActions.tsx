
import { useState } from 'react';
import { ModernButton } from '@/components/ui/modern-button';
import { CheckInDialog } from '@/components/checkin/CheckInDialog';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { Clock, FileText, User, Plus } from 'lucide-react';

export function DashboardActions() {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <ModernButton 
        onClick={() => setCheckInOpen(true)} 
        variant="primary"
        className="flex items-center gap-2"
      >
        <Clock className="h-4 w-4" />
        Check-in Rápido
      </ModernButton>
      
      <ModernButton 
        onClick={() => setReportOpen(true)} 
        variant="secondary"
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Gerar Relatório
      </ModernButton>
      
      <ModernButton 
        onClick={() => setProfileOpen(true)} 
        variant="ghost"
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Meu Perfil
      </ModernButton>

      <CheckInDialog open={checkInOpen} onOpenChange={setCheckInOpen} />
      <ReportGenerator open={reportOpen} onClose={() => setReportOpen(false)} />
      <EditProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
