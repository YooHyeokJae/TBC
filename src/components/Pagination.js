import React from 'react';

export default function Pagination({page, setPage, grid, totalCnt}) {
    let strPage = (Math.ceil(page / 10) - 1) * 10 + 1;
    let endPage = (Math.ceil(page / 10)) * 10;
    const pageItems = []
    for(let i = strPage; i <= endPage; i++) {
        pageItems.push(
            <li key={i} className={`page-item ${i === page ? 'active' : ''} ${i > Math.ceil(totalCnt / grid) ? 'disabled' : ''}`}>
                <a className="page-link" href="#" onClick={(e) => {
                    e.preventDefault();
                    setPage(i);
                }}>{i}</a>
            </li>);
    }

    return (
        <div className="d-flex">
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <a className={`page-link ${strPage === 1 ? 'disabled' : ''}`} href="#" aria-label="Previous"
                           onClick={(e) => {
                               e.preventDefault();
                               setPage(strPage - 1);
                           }}><span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    {pageItems}
                    <li className="page-item">
                        <a className={`page-link ${endPage > Math.ceil(totalCnt / grid) ? 'disabled' : ''}`} href="#" aria-label="Next"
                           onClick={(e) => {
                               e.preventDefault();
                               setPage(endPage + 1);
                           }}><span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <span className="align-content-center small text-muted ms-2">Total Count: {totalCnt}</span>
        </div>
    );
}
