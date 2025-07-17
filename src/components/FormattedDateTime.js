import React from 'react';
import { formatDateTime } from '../utils/formatDateTime';

export default function FormattedDateTime({ date }) {
    if (!date) return <span>날짜 없음</span>;
    return <span>{formatDateTime(date)}</span>;
}
