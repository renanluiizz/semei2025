
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModernTableProps {
  title: string;
  children: React.ReactNode;
  headers: string[];
  className?: string;
}

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernTable({ title, children, headers, className = "" }: ModernTableProps) {
  return (
    <Card className={`semei-card animate-fade-in ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-2xl">
        <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider first:rounded-tl-none last:rounded-tr-none"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {children}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModernTableRow({ children, className = "" }: ModernTableRowProps) {
  return (
    <tr className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 ${className}`}>
      {children}
    </tr>
  );
}

export function ModernTableCell({ children, className = "" }: ModernTableCellProps) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
}
