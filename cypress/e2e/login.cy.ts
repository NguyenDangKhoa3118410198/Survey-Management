describe('Login Page', () => {
  const paths = ['/login', '/'];

  // Hàm tiện ích để kiểm tra các thành phần trong form
  const checkFormElements = () => {
    cy.get('[data-testid="title-login"]').should('exist').contains('The Liems');
    cy.get('[data-testid="title-login"]').contains(
      'Admin Panel Management Survey'
    );
    cy.get('[data-testid="login-page-input-email"]').should('exist');
    cy.get('[data-testid="login-page-input-password"]').should('exist');
    cy.get('[data-testid="login-page-remember-password"]').should('exist');
    cy.get('[data-testid="login-page-btn-login"]').should('exist');
  };

  // Kiểm tra khả năng truy cập localhost
  describe('Access', () => {
    it('should open localhost', () => {
      cy.visit('http://localhost:5173/');
    });
  });

  // Kiểm tra hiển thị form
  describe('Form Render', () => {
    paths.forEach((path) => {
      it(`should render form on ${path}`, () => {
        cy.visit(path);
        checkFormElements();
      });
    });
  });

  // Kiểm tra nhập liệu và xác thực
  describe('Form Validation', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'test';
    const validPassword = 'Pass@123456';
    const invalidPassword = 'pass123';

    paths.forEach((path) => {
      beforeEach(() => {
        cy.visit(path);
      });

      it('should accept valid email', () => {
        cy.get('[data-testid="login-page-input-email"]').type(validEmail);
        cy.get('[data-testid="login-page-input-email"]').should(
          'have.value',
          validEmail
        );
      });

      it('should show error for invalid email', () => {
        cy.get('[data-testid="login-page-input-email"]').type(invalidEmail);
        cy.contains('Email không hợp lệ').should('exist');
      });

      it('should show error for invalid password', () => {
        cy.get('[data-testid="login-page-input-password"]').type(
          invalidPassword
        );
        cy.contains(
          'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt'
        ).should('exist');
      });

      it('should show error for valid email but invalid password', () => {
        cy.get('[data-testid="login-page-input-email"]').type(validEmail);
        cy.get('[data-testid="login-page-input-password"]').type(
          invalidPassword
        );
        cy.contains(
          'Mật khẩu đảm bảo có ít nhất 8 ký tự, ít nhất 1 ký tự chữ và ít nhất 1 ký tự đặc biệt'
        ).should('exist');
      });

      it('should show error for invalid email but valid password', () => {
        cy.get('[data-testid="login-page-input-email"]').type(invalidEmail);
        cy.get('[data-testid="login-page-input-password"]').type(validPassword);
        cy.get('[data-testid="login-page-btn-login"]').click();
        cy.contains('Email không hợp lệ').should('exist');
      });
    });
  });
});