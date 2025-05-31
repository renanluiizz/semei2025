
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModernTableProps {
  title?: string;
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function ModernTable({ title, headers, children, className = "" }: ModernTableProps) {
  return (
    <Card className={`semei-card ${className}`}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="semei-table-header">
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    className="px-6 py-3 text-left first:rounded-tl-2xl last:rounded-tr-2xl"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ModernTableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ModernTableRow({ children, onClick, className = "" }: ModernTableRowProps) {
  return (
    <tr 
      className={`hover:bg-gray-50 transition-colors duration-150 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernTableCell({ children, className = "" }: ModernTableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
}
