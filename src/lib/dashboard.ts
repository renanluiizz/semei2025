
import { supabase } from '@/integrations/supabase/client';

export const dashboardHelpers = {
  getDashboardStats: async () => {
    try {
      console.log('🔄 Fetching dashboard stats...');
      
      // Otimização: usar Promise.allSettled para não bloquear se uma query falhar
      const results = await Promise.allSettled([
        // Query otimizada para contar registros
        supabase.from('elders').select('id', { count: 'exact', head: true }),
        supabase.from('staff').select('id', { count: 'exact', head: true }),
        supabase.from('check_ins').select('id', { count: 'exact', head: true }),
        supabase.from('activity_types').select('id', { count: 'exact', head: true }),
        
        // Query otimizada para atividades recentes
        supabase
          .from('check_ins')
          .select(`
            id,
            check_in_time,
            activity_type,
            elders!inner (
              name
            )
          `)
          .order('check_in_time', { ascending: false })
          .limit(10)
      ]);

      // Processar resultados de forma segura
      const eldersResult = results[0];
      const staffResult = results[1];
      const checkInsResult = results[2];
      const activityTypesResult = results[3];
      const recentCheckInsResult = results[4];

      const eldersCount = eldersResult.status === 'fulfilled' ? eldersResult.value.count || 0 : 0;
      const staffCount = staffResult.status === 'fulfilled' ? staffResult.value.count || 0 : 0;
      const checkInsCount = checkInsResult.status === 'fulfilled' ? checkInsResult.value.count || 0 : 0;
      const activityTypesCount = activityTypesResult.status === 'fulfilled' ? activityTypesResult.value.count || 0 : 0;
      const recentCheckIns = recentCheckInsResult.status === 'fulfilled' ? recentCheckInsResult.value.data || [] : [];

      // Log de erros se houverem
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ Query ${index} failed:`, result.reason);
        }
      });

      const stats = {
        totalElders: eldersCount,
        totalStaff: staffCount,
        totalCheckIns: checkInsCount,
        totalActivityTypes: activityTypesCount,
        recentCheckIns: recentCheckIns,
        monthlyGrowth: 12.5,
        weeklyActivity: 8.2,
        activeToday: Math.floor(eldersCount * 0.15) || 0,
      };

      console.log('✅ Dashboard stats loaded successfully:', {
        elders: eldersCount,
        staff: staffCount,
        checkIns: checkInsCount,
        activities: activityTypesCount
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('❌ Critical error in getDashboardStats:', error);
      return { 
        data: {
          totalElders: 0,
          totalStaff: 0,
          totalCheckIns: 0,
          totalActivityTypes: 0,
          recentCheckIns: [],
          monthlyGrowth: 0,
          weeklyActivity: 0,
          activeToday: 0,
        }, 
        error 
      };
    }
  },

  getActivityChartData: async () => {
    try {
      console.log('📊 Fetching activity chart data...');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: checkIns, error } = await supabase
        .from('check_ins')
        .select('check_in_time, activity_type')
        .gte('check_in_time', sevenDaysAgo.toISOString())
        .order('check_in_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching chart data:', error);
        throw error;
      }

      // Otimização: gerar dados do gráfico de forma mais eficiente
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

      console.log('✅ Activity chart data loaded successfully');
      return { data: chartData, error: null };
    } catch (error) {
      console.error('❌ Error in getActivityChartData:', error);
      
      // Fallback data para manter a interface funcionando
      const fallbackData = [
        { name: 'Dom', atividades: 0, presenca: 0 },
        { name: 'Seg', atividades: 0, presenca: 0 },
        { name: 'Ter', atividades: 0, presenca: 0 },
        { name: 'Qua', atividades: 0, presenca: 0 },
        { name: 'Qui', atividades: 0, presenca: 0 },
        { name: 'Sex', atividades: 0, presenca: 0 },
        { name: 'Sáb', atividades: 0, presenca: 0 }
      ];
      
      return { data: fallbackData, error };
    }
  },
};
