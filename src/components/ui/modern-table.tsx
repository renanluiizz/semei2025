
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernTableProps {
  title: string;
  children: React.ReactNode;
  headers: string[];
  className?: string;
  actions?: React.ReactNode;
}

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernTable({ title, children, headers, className, actions }: ModernTableProps) {
  return (
    <div className={cn('semei-card animate-fade-in', className)}>
      <div className="semei-card-header flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="semei-table">
          <thead className="semei-table-header">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="semei-table-header th">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ModernTableRow({ children, className, hoverable = true }: ModernTableRowProps) {
  return (
    <tr className={cn(
      'semei-table-row',
      hoverable && 'hover:bg-slate-50/50',
      className
    )}>
      {children}
    </tr>
  );
}

export function ModernTableCell({ children, className }: ModernTableCellProps) {
  return (
    <td className={cn('semei-table-cell', className)}>
      {children}
    </td>
  );
}
