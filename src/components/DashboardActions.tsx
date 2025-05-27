
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckInDialog } from '@/components/checkin/CheckInDialog';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { Clock, FileText, User } from 'lucide-react';

export function DashboardActions() {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={() => setCheckInOpen(true)} className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Check-in
      </Button>
      
      <Button onClick={() => setReportOpen(true)} variant="outline" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Relatórios
      </Button>
      
      <Button onClick={() => setProfileOpen(true)} variant="outline" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Meu Perfil
      </Button>

      <CheckInDialog open={checkInOpen} onOpenChange={setCheckInOpen} />
      <ReportGenerator open={reportOpen} onClose={() => setReportOpen(false)} />
      <EditProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
