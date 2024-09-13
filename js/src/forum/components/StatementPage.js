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

  head(){
    return ;
  }

  async loadData(key = '', page = 1) {
    try {
      const response = await fetch(`http://localhost:8099?query=${key}&page=${page}`);
      const data = await response.json();

      this.data = data.hits;
      this.searchTerm = key;
      this.currentPage = page;
      this.totalPages = data.nbPages; // Cập nhật tổng số trang
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
            m('div', { class: 'iconcontainer' }, [m('div', { class: 'icocont' }, m('div', { class: 'titolo1' }, 'Check var sao kê Mặt trận tổ quốc Việt Nam'))]),
            m('.StatementPage', [
              m('p', 'Lưu ý: dữ liệu chỉ trong phạm vi từ 1/9/2024 đến 10/9/2024. Chúng tôi sẽ cập nhật khi có dữ liệu mới từ MTTQ.'),
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
                          m('td.scm-td', { style: 'text-align:center', 'data-title': 'STT' }, (this.currentPage - 1) * 20 + colIndex + 1),
                          m('td.scm-td', { 'data-title': 'Ngày' }, m.trust(this.highlightText(value._highlightResult.date.value))),
                          m('td.scm-td', { 'data-title': 'Ngân hàng' }, m.trust(this.highlightText(value._highlightResult.bank.value))),
                          m(
                            'td.scm-td',
                            { 'data-title': 'Tiền' },
                            m.trust(this.highlightText(this.formatCurrency(value._highlightResult.credit.value)))
                          ),
                          m('td.scm-td', { 'data-title': 'Chi tiết' }, m.trust(this.highlightText(value._highlightResult.detail.value))),
                        ])
                      )
                    : m('tr.scm-tr', [m('td.scm-td', { colspan: '5', style: 'text-align:center' }, 'Không có dữ liệu')]),
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
