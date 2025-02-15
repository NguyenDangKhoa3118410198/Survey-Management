import 'antd/dist/reset.css'; 
import { BrowserRouter } from 'react-router-dom'
import Login from '../components/Login'

describe('<Login />', () => {
  it('renders', () => {
    cy.mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  })

  it('should display error password message on invalid login', () => {
    cy.mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    // Giả lập nhập thông tin không hợp lệ.
    cy.get('[data-testid="login-page-input-email"]').type('admin@gmail.com')
    cy.get('[data-testid="login-page-input-password"]').type('wrongPassword')
    cy.get('[data-testid="login-page-btn-login"]').click()

    // Kiểm tra xem thông báo lỗi có hiển thị không
    cy.contains(
      'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt'
    ).should('exist');
  })

  
  it('should display error email message on invalid login', () => {
    cy.mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    // Giả lập nhập thông tin không hợp lệ
    cy.get('[data-testid="login-page-input-email"]').type('admin@')
    cy.get('[data-testid="login-page-input-password"]').type('123456a@')
    cy.get('[data-testid="login-page-btn-login"]').click()

    // Kiểm tra xem thông báo lỗi có hiển thị không
    cy.contains('Email không hợp lệ').should('exist');
  })
})