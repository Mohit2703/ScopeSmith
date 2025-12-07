'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function DataTable({
    columns,
    data,
    isLoading = false,
    onRowClick,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    pagination,
    emptyMessage = 'No data found',
    actions,
    title,
    headerActions,
}) {
    const [localSelected, setLocalSelected] = useState([]);
    const selected = onSelectionChange ? selectedRows : localSelected;
    const setSelected = onSelectionChange || setLocalSelected;

    const toggleAll = () => {
        if (selected.length === data.length) {
            setSelected([]);
        } else {
            setSelected(data.map((_, i) => i));
        }
    };

    const toggleRow = (index) => {
        if (selected.includes(index)) {
            setSelected(selected.filter(i => i !== index));
        } else {
            setSelected([...selected, index]);
        }
    };

    const renderSkeleton = () => (
        <>
            {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-border">
                    {selectable && (
                        <td className="px-4 py-4">
                            <div className="w-4 h-4 skeleton rounded" />
                        </td>
                    )}
                    {columns.map((col, j) => (
                        <td key={j} className="px-4 py-4">
                            <div className={`h-4 skeleton rounded ${j === 0 ? 'w-32' : 'w-24'}`} />
                        </td>
                    ))}
                    {actions && (
                        <td className="px-4 py-4 text-right">
                            <div className="h-8 w-16 skeleton rounded ml-auto" />
                        </td>
                    )}
                </tr>
            ))}
        </>
    );

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            {(title || headerActions) && (
                <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                    {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
                    {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            {selectable && (
                                <th className="px-4 py-3 w-12">
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && selected.length === data.length}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                </th>
                            )}
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            renderSkeleton()
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    onClick={() => onRowClick && onRowClick(row, rowIndex)}
                                    className={`hover:bg-muted/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${selected.includes(rowIndex) ? 'bg-primary/5' : ''}`}
                                >
                                    {selectable && (
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(rowIndex)}
                                                onChange={() => toggleRow(rowIndex)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                            />
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className={`px-4 py-4 ${column.cellClassName || ''}`}>
                                            {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            {actions(row, rowIndex)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {pagination.from}-{pagination.to} of {pagination.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={pagination.onPrevious}
                            disabled={pagination.from === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={pagination.onNext}
                            disabled={pagination.to >= pagination.total}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
