
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModernTableProps {
  title: string;
  children: React.ReactNode;
  headers: string[];
}

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernTable({ title, children, headers }: ModernTableProps) {
  return (
    <Card className="semei-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-blue-100">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-6 py-4 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
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
