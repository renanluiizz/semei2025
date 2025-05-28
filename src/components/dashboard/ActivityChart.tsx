
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ActivityChartProps {
  data: Array<{
    name: string;
    atividades: number;
    presenca: number;
  }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividades vs Presença (Últimos 7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'atividades' ? 'Atividades' : 'Presença']}
              labelFormatter={(label) => `Dia: ${label}`}
            />
            <Bar dataKey="atividades" fill="#3b82f6" name="atividades" radius={[4, 4, 0, 0]} />
            <Bar dataKey="presenca" fill="#10b981" name="presenca" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
