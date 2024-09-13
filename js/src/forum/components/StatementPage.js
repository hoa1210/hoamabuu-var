import Page from 'flarum/components/Page';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';

export default class StatementPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    this.data = [];
    this.searchTerm = '';
    this.currentPage = 1; // Trang hiện tại
    this.totalPages = 1; // Tổng số trang
    this.loadData();
  }

  oncreate(vnode) {
    super.oncreate(vnode);
  }

  onupdate(vnode) {
    super.onupdate(vnode);
  }

  async loadData(key = '', page = 1) {
    try {
      const response = await fetch(`https://checkvar.hotroit.org/?query=${key}&page=${page}`);
      const data = await response.json();

      this.data = data.hits;
      this.searchTerm = key;
      this.currentPage = page;
      this.totalPages = data.nbPages;
      m.redraw();
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }

  highlightText(text, keyword = this.searchTerm) {
    return text;
  }

  formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
  }

  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.loadData(this.searchTerm, page);
    window.scrollTo(0, 0);
  }

  view() {
    return m('.IndexPage', [
      IndexPage.prototype.hero(),
      m(
        '.container',
        m('.sideNavContainer', [
          m('nav.IndexPage-nav.sideNav', m('ul', listItems(IndexPage.prototype.sidebarItems().toArray()))),
          m(
            '.IndexPage-results.sideNavOffset',
            m('div', { class: 'iconcontainer' }, [m('h2', 'Check var sao kê Mặt trận tổ quốc Việt Nam')]),
            m('.StatementPage', [
              m(
                'p',
                'Lưu ý: dữ liệu được lấy từ 2 nguồn sau: ',
                m('a', { href: 'https://drive.google.com/file/d/1itY9sSy5uLE2OknDZbG0eqoXT7-uFqRP/view?usp=sharing' }, 'sao kê Vietcombank'),
                ', ',
                m('a', { href: 'https://drive.google.com/file/d/1iRsk2BqJ29zAXI1nXJxlxm-xef0jSxJV/view?usp=sharing' }, 'sao kê Vietinbank')
              ),
              m('input.form-control', {
                type: 'text',
                name: 'name',
                placeholder: 'Tìm kiếm theo mã giao dịch, số tiền hoặc chi tiết giao dịch',
                onkeydown: (event) => {
                  if (event.key === 'Enter') {
                    this.loadData(event.target.value.trim());
                  }
                },
              }),
              m('table.scm-table', [
                m('thead.scm-thead', [
                  m('tr.scm-tr', [
                    m('th.scm-th', 'STT'),
                    m('th.scm-th', 'Ngày'),
                    m('th.scm-th', 'Ngân Hàng'),
                    m('th.scm-th', 'Tiền'),
                    m('th.scm-th', 'Chi tiết'),
                  ]),
                ]),
                m('tbody.scm-tbody', [
                  this.data && this.data.length > 0
                    ? this.data.map((value, colIndex) =>
                        m('tr.scm-tr', { key: colIndex }, [
                          m('td.scm-td', { 'data-title': 'STT' }, (this.currentPage - 1) * 20 + colIndex + 1),
                          m('td.scm-td', { 'data-title': 'Ngày' }, m.trust(this.highlightText(value._highlightResult.date.value))),
                          m('td.scm-td', { 'data-title': 'Ngân hàng' }, m.trust(this.highlightText(value._highlightResult.bank.value))),
                          m('td.scm-td', { 'data-title': 'Tiền' }, m.trust(this.formatCurrency(value.credit))),
                          m('td.scm-td', { 'data-title': 'Chi tiết' }, m.trust(this.highlightText(value._highlightResult.detail.value))),
                        ])
                      )
                    : m('tr', [m('td', { colspan: '5', style: 'text-align:center' }, 'Không có dữ liệu')]),
                ]),
              ]),
              m('div', [
                this.data && this.data.length > 0
                  ? m('.pagination', [
                      m(
                        'button.pagination-btn',
                        {
                          disabled: this.currentPage === 1,
                          onclick: () => this.changePage(this.currentPage - 1),
                        },
                        '« Trước'
                      ),
                      m('span.pagination-page', `Trang ${this.currentPage} của ${this.totalPages}`),
                      m(
                        'button.pagination-btn',
                        {
                          disabled: this.currentPage === this.totalPages,
                          onclick: () => this.changePage(this.currentPage + 1),
                        },
                        'Tiếp »'
                      ),
                    ])
                  : '',
              ]),
            ])
          ),
        ])
      ),
    ]);
  }
}
