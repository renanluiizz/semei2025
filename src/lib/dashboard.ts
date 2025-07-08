
import { supabase } from '@/integrations/supabase/client';

export const dashboardHelpers = {
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      
      // Buscar dados em paralelo para melhor performance
      const [
        { count: eldersCount, error: eldersError },
        { count: staffCount, error: staffError },
        { count: checkInsCount, error: checkInsError },
        { count: activityTypesCount, error: activityTypesError },
        { data: recentCheckIns, error: recentError }
      ] = await Promise.all([
        supabase.from('elders').select('*', { count: 'exact', head: true }),
        supabase.from('staff').select('*', { count: 'exact', head: true }),
        supabase.from('check_ins').select('*', { count: 'exact', head: true }),
        supabase.from('activity_types').select('*', { count: 'exact', head: true }),
        supabase
          .from('check_ins')
          .select(`
            *,
            elders (
              name,
              cpf
            ),
            staff (
              full_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Verificar erros
      if (eldersError) throw eldersError;
      if (staffError) throw staffError;
      if (checkInsError) throw checkInsError;
      if (activityTypesError) throw activityTypesError;
      if (recentError) throw recentError;

      const stats = {
        totalElders: eldersCount || 0,
        totalStaff: staffCount || 0,
        totalCheckIns: checkInsCount || 0,
        totalActivityTypes: activityTypesCount || 0,
        recentCheckIns: recentCheckIns || [],
        monthlyGrowth: 12.5,
        weeklyActivity: 8.2,
        activeToday: Math.floor((checkInsCount || 0) * 0.15),
      };

      console.log('Dashboard stats fetched successfully:', stats);
      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return { data: null, error };
    }
  },

  getActivityChartData: async () => {
    try {
      console.log('Fetching activity chart data...');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: checkIns, error } = await supabase
        .from('check_ins')
        .select('check_in_time, activity_type')
        .gte('check_in_time', sevenDaysAgo.toISOString())
        .order('check_in_time', { ascending: true });

      if (error) throw error;

      const chartData = [];
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayCheckIns = checkIns?.filter(checkin => {
          const checkinDate = new Date(checkin.check_in_time);
          return checkinDate >= dayStart && checkinDate <= dayEnd;
        }) || [];
        
        chartData.push({
          name: dayName,
          atividades: dayCheckIns.length,
          presenca: dayCheckIns.length
        });
      }

      console.log('Activity chart data fetched successfully:', chartData);
      return { data: chartData, error: null };
    } catch (error) {
      console.error('Error in getActivityChartData:', error);
      return { data: [], error };
    }
  },
};
