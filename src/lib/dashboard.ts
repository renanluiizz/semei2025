
import { supabase } from '@/integrations/supabase/client';

export const dashboardHelpers = {
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      
      // Get total elders count
      const { count: eldersCount, error: eldersError } = await supabase
        .from('elders')
        .select('*', { count: 'exact', head: true });

      if (eldersError) {
        console.error('Error fetching elders count:', eldersError);
        throw eldersError;
      }

      // Get total staff count
      const { count: staffCount, error: staffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true });

      if (staffError) {
        console.error('Error fetching staff count:', staffError);
        throw staffError;
      }

      // Get total check-ins count
      const { count: checkInsCount, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*', { count: 'exact', head: true });

      if (checkInsError) {
        console.error('Error fetching check-ins count:', checkInsError);
        throw checkInsError;
      }

      // Get total activity types count
      const { count: activityTypesCount, error: activityTypesError } = await supabase
        .from('activity_types')
        .select('*', { count: 'exact', head: true });

      if (activityTypesError) {
        console.error('Error fetching activity types count:', activityTypesError);
        throw activityTypesError;
      }

      // Get recent check-ins with details
      const { data: recentCheckIns, error: recentError } = await supabase
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
        .limit(10);

      if (recentError) {
        console.error('Error fetching recent check-ins:', recentError);
        throw recentError;
      }

      const stats = {
        totalElders: eldersCount || 0,
        totalStaff: staffCount || 0,
        totalCheckIns: checkInsCount || 0,
        totalActivityTypes: activityTypesCount || 0,
        recentCheckIns: recentCheckIns || [],
        monthlyGrowth: 12.5, // Mock data - can be calculated from real data
        weeklyActivity: 8.2, // Mock data - can be calculated from real data
        activeToday: Math.floor((checkInsCount || 0) * 0.15), // Mock calculation
      };

      console.log('Dashboard stats:', stats);
      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return { data: null, error };
    }
  },

  getActivityChartData: async () => {
    try {
      console.log('Fetching activity chart data...');
      
      // Get check-ins from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: checkIns, error } = await supabase
        .from('check_ins')
        .select('check_in_time, activity_type')
        .gte('check_in_time', sevenDaysAgo.toISOString())
        .order('check_in_time', { ascending: true });

      if (error) {
        console.error('Error fetching check-ins for chart:', error);
        throw error;
      }

      // Process data to create chart format
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
          presenca: dayCheckIns.length // For now, treating check-ins as presence
        });
      }

      console.log('Activity chart data:', chartData);
      return { data: chartData, error: null };
    } catch (error) {
      console.error('Error in getActivityChartData:', error);
      return { data: [], error };
    }
  },
};
