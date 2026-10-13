import type { Locale } from './types'

export const en: Locale = {
  common: {
    welcome: "Welcome to AI Body Editor",
    siteName: "AI Body Editor",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",
    and: "and",
    loading: "Loading...",
    unexpectedError: "An unexpected error occurred",
    notAvailable: "N/A",
    viewPlans: "View Plans",
    yes: "Yes",
    no: "No",
    theme: {
      light: "Light Theme",
      dark: "Dark Theme",
      system: "System Theme",
      toggle: "Toggle Theme",
      appearance: "Appearance",
      colorScheme: "Color Scheme",
      themes: {
        default: "Default",
        claude: "Claude",
        "cosmic-night": "Cosmic Night",
        "modern-minimal": "Modern Minimal",
        "ocean-breeze": "Ocean Breeze"
      }
    }
  },
  navigation: {
    home: "Home",
    dashboard: "Dashboard",
    orders: "Orders",
    shipments: "Shipments",
    tracking: "Tracking",
    admin: {
      dashboard: "Dashboard",
      users: "Users",
      subscriptions: "Subscriptions",
      orders: "Orders",
      credits: "Credits",
      pricing: "Pricing",
      application: "Application",
      blog: "Blog",
      commissions: "Commissions",
      withdrawals: "Withdrawals"
    }
  },
  actions: {
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    tryAgain: "Try again",
    createAccount: "Create account",
    sendCode: "Send Code",
    verify: "Verify",
    backToList: "Back to Users",
    saveChanges: "Save Changes",
    createUser: "Create User",
    deleteUser: "Delete User",
    back: "Back",
    resendCode: "Resend Code",
    resendVerificationEmail: "Resend Verification Email",
    upload: "Upload",
    previous: "Previous",
    next: "Next",
    createPost: "New Post",
    deletePost: "Delete Post",
    backToBlog: "Back to Blog"
  },
  email: {
    verification: {
      subject: "Verify your AI Body Editor account",
      title: "Verify your email address",
      greeting: "Hello {{name}},",
      message: "Thank you for registering with AI Body Editor. To complete your registration, please click the button below to verify your email address.",
      button: "Verify Email Address",
      alternativeText: "Or, copy and paste the following link into your browser:",
      expiry: "This link will expire in {{expiry_hours}} hours.",
      disclaimer: "If you didn't request this verification, please ignore this email.",
      signature: "The AI Body Editor Team",
    copyright: "© {{year}} AI Body Editor. All rights reserved."
    },
    resetPassword: {
      subject: "Reset your AI Body Editor password",
      title: "Reset your password",
      greeting: "Hello {{name}},",
      message: "We received a request to reset your password. Please click the button below to create a new password. If you didn't make this request, you can safely ignore this email.",
      button: "Reset Password",
      alternativeText: "Or, copy and paste the following link into your browser:",
      expiry: "This link will expire in {{expiry_hours}} hours.",
      disclaimer: "If you didn't request a password reset, no action is required.",
      signature: "The AI Body Editor Team",
      copyright: "© {{year}} AI Body Editor. All rights reserved."
    }
  },
  auth: {
    metadata: {
      signin: {
        title: "AI Body Editor - Sign In",
        description: "Sign in to your AI Body Editor account to access your dashboard, manage subscriptions, and use premium features.",
        keywords: "sign in, login, authentication, account access, dashboard"
      },
      signup: {
        title: "AI Body Editor - Create Account",
        description: "Create your AI Body Editor account and start building amazing SaaS applications with our comprehensive starter kit.",
        keywords: "sign up, register, create account, new user, get started"
      },
      forgotPassword: {
        title: "AI Body Editor - Reset Password",
        description: "Reset your AI Body Editor account password securely. Enter your email to receive password reset instructions.",
        keywords: "forgot password, reset password, password recovery, account recovery"
      },
      resetPassword: {
        title: "AI Body Editor - Create New Password",
        description: "Create a new secure password for your AI Body Editor account. Choose a strong password to protect your account.",
        keywords: "new password, password reset, secure password, account security"
      },
      phone: {
        title: "AI Body Editor - Phone Login",
        description: "Sign in to AI Body Editor using your phone number. Quick and secure authentication with SMS verification.",
        keywords: "phone login, SMS verification, mobile authentication, phone number"
      },
      wechat: {
        title: "AI Body Editor - WeChat Login",
        description: "Sign in to AI Body Editor using your WeChat account. Convenient authentication for Chinese users.",
        keywords: "WeChat login, 微信登录, social login, Chinese authentication"
      }
    },
    signin: {
      title: "Sign in to your account",
      welcomeBack: "Welcome back",
      socialLogin: "Sign in with your favorite social account",
      continueWith: "Or continue with",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      submit: "Sign in",
      submitting: "Signing in...",
      noAccount: "Don't have an account?",
      signupLink: "Sign up",
      termsNotice: "By clicking continue, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      socialProviders: {
        google: "Google",
        github: "GitHub",
        apple: "Apple",
        wechat: "WeChat",
        phone: "Phone"
      },
      errors: {
        invalidEmail: "Please enter a valid email",
        requiredEmail: "Email is required",
        requiredPassword: "Password is required",
        invalidCredentials: "Invalid email or password",
        captchaRequired: "Please complete the captcha verification",
        emailNotVerified: {
          title: "Email verification required",
          description: "Please check your email and click the verification link. If you haven't received the email, click the button below to resend.",
          resendSuccess: "Verification email has been resent, please check your inbox.",
          resendError: "Failed to resend verification email, please try again later.",
          dialogTitle: "Resend Verification Email",
          dialogDescription: "Please complete the captcha verification before resending the verification email",
          emailLabel: "Email Address",
          sendButton: "Send Verification Email",
          sendingButton: "Sending...",
          waitButton: "Wait {seconds}s"
        }
      }
    },
    signup: {
      title: "Sign up for AI Body Editor",
      createAccount: "Create an account",
      socialSignup: "Sign up with your favorite social account",
      continueWith: "Or continue with",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Create a password",
      imageUrl: "Profile Image URL",
      imageUrlPlaceholder: "https://example.com/your-image.jpg",
      optional: "Optional",
      submit: "Create account",
      submitting: "Creating account...",
      haveAccount: "Already have an account?",
      signinLink: "Sign in",
      termsNotice: "By clicking continue, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      verification: {
        title: "Verification Required",
        sent: "We've sent a verification email to",
        checkSpam: "Can't find the email? Please check your spam folder.",
        spamInstruction: "If you still don't see it,"
      },
      errors: {
        invalidName: "Please enter a valid name",
        requiredName: "Name is required",
        invalidEmail: "Please enter a valid email",
        requiredEmail: "Email is required",
        invalidPassword: "Please enter a valid password",
        requiredPassword: "Password is required",
        invalidImage: "Please enter a valid image URL",
        captchaRequired: "Please complete the captcha verification",
        captchaError: "Captcha verification failed, please try again",
        captchaExpired: "Captcha verification expired, please try again"
      }
    },
    phone: {
      title: "Login with Phone",
      description: "Enter your phone number to receive a verification code",
      phoneNumber: "Phone Number",
      phoneNumberPlaceholder: "Enter your phone number",
      countryCode: "Country/Region",
      verificationCode: "Verification Code",
      enterCode: "Enter Verification Code",
      sendingCode: "Sending code...",
      verifying: "Verifying...",
      codeSentTo: "Verification code sent to",
      resendIn: "Resend in",
      seconds: "seconds",
      resendCode: "Resend Code",
      resendCountdown: "seconds remaining",
      termsNotice: "By clicking continue, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      errors: {
        invalidPhone: "Please enter a valid phone number",
        requiredPhone: "Phone number is required",
        requiredCountryCode: "Please select country/region",
        invalidCode: "Please enter a valid verification code",
        requiredCode: "Verification code is required",
        captchaRequired: "Please complete the captcha verification"
      }
    },
    forgetPassword: {
      title: "Forgot Password",
      description: "Reset your password and regain access to your account",
      email: "Email",
      emailPlaceholder: "Enter your email",
      submit: "Send reset link",
      submitting: "Sending...",
      termsNotice: "By clicking continue, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      verification: {
        title: "Check your email",
        sent: "We've sent a password reset link to",
        checkSpam: "Can't find the email? Please check your spam folder."
      },
      errors: {
        invalidEmail: "Please enter a valid email",
        requiredEmail: "Email is required",
        captchaRequired: "Please complete the captcha verification"
      }
    },
    resetPassword: {
      title: "Reset Password",
      description: "Create a new password for your account",
      password: "New Password",
      passwordPlaceholder: "Enter your new password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your new password",
      submit: "Reset Password",
      submitting: "Resetting...",
      success: {
        title: "Password Reset Successful",
        description: "Your password has been successfully reset.",
        backToSignin: "Back to Sign In",
        goToSignIn: "Back to Sign In"
      },
      errors: {
        invalidPassword: "Password must be at least 8 characters",
        requiredPassword: "Password is required",
        passwordsDontMatch: "Passwords don't match",
        invalidToken: "Invalid or expired reset link. Please try again."
      }
    },
    wechat: {
      title: "WeChat Login",
      description: "Scan with WeChat to log in",
      scanQRCode: "Please scan the QR code with WeChat",
      orUseOtherMethods: "Or use other login methods",
      loadingQRCode: "Loading QR code...",
      termsNotice: "By clicking continue, you agree to our",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      errors: {
        loadingFailed: "Failed to load WeChat QR code",
        networkError: "Network error, please try again"
      }
    },
    // Auth error codes mapping for Better Auth 1.4
    authErrors: {
      // User errors
      USER_NOT_FOUND: "No account found with this email",
      USER_ALREADY_EXISTS: "User with this email already exists",
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Please use another email",
      USER_EMAIL_NOT_FOUND: "User email not found",
      FAILED_TO_CREATE_USER: "Failed to create user",
      FAILED_TO_UPDATE_USER: "Failed to update user",
      
      // Authentication errors
      INVALID_EMAIL: "Invalid email address",
      INVALID_PASSWORD: "Invalid password",
      INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
      INVALID_CREDENTIALS: "Invalid credentials provided",
      INVALID_TOKEN: "Invalid or expired token",
      PASSWORD_TOO_SHORT: "Password is too short",
      PASSWORD_TOO_LONG: "Password is too long",
      
      // Email verification errors
      EMAIL_NOT_VERIFIED: "Please verify your email address",
      EMAIL_ALREADY_VERIFIED: "Email is already verified",
      EMAIL_MISMATCH: "Email mismatch",
      EMAIL_CAN_NOT_BE_UPDATED: "Email cannot be updated",
      VERIFICATION_EMAIL_NOT_ENABLED: "Verification email is not enabled",
      
      // Session errors
      SESSION_EXPIRED: "Your session has expired. Please sign in again",
      SESSION_NOT_FRESH: "Session is not fresh. Please re-authenticate",
      FAILED_TO_CREATE_SESSION: "Failed to create session",
      FAILED_TO_GET_SESSION: "Failed to get session",
      
      // Account errors
      ACCOUNT_NOT_FOUND: "Account not found",
      ACCOUNT_BLOCKED: "Your account has been temporarily blocked",
      CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
      SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account is already linked",
      LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
      FAILED_TO_UNLINK_LAST_ACCOUNT: "Cannot unlink your last account",
      USER_ALREADY_HAS_PASSWORD: "User already has a password",
      
      // Phone number errors
      PHONE_NUMBER_ALREADY_EXISTS: "Phone number is already registered",
      INVALID_PHONE_NUMBER: "Invalid phone number format",
      OTP_EXPIRED: "Verification code has expired",
      INVALID_OTP: "Invalid verification code",
      OTP_TOO_MANY_ATTEMPTS: "Too many verification attempts. Please request a new code",
      
      // Provider errors
      PROVIDER_NOT_FOUND: "Provider not found",
      ID_TOKEN_NOT_SUPPORTED: "ID token not supported",
      FAILED_TO_GET_USER_INFO: "Failed to get user info",
      
      // Security errors
      CAPTCHA_REQUIRED: "Please complete the captcha verification",
      CAPTCHA_INVALID: "Captcha verification failed",
      TOO_MANY_REQUESTS: "Too many requests. Please try again later",
      CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked",
      INVALID_ORIGIN: "Invalid origin",
      MISSING_OR_NULL_ORIGIN: "Missing or invalid origin",
      
      // Callback URL errors
      INVALID_CALLBACK_URL: "Invalid callback URL",
      INVALID_REDIRECT_URL: "Invalid redirect URL",
      INVALID_ERROR_CALLBACK_URL: "Invalid error callback URL",
      INVALID_NEW_USER_CALLBACK_URL: "Invalid new user callback URL",
      CALLBACK_URL_REQUIRED: "Callback URL is required",
      
      // Validation errors
      VALIDATION_ERROR: "Validation error",
      MISSING_FIELD: "Required field is missing",
      FIELD_NOT_ALLOWED: "Field is not allowed",
      ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
      
      // System errors
      FAILED_TO_CREATE_VERIFICATION: "Failed to create verification",
      EMAIL_SEND_FAILED: "Failed to send email. Please try again later",
      SMS_SEND_FAILED: "Failed to send SMS. Please try again later",
      UNKNOWN_ERROR: "An unexpected error occurred"
    }
  },
  admin: {
    metadata: {
      title: "AI Body Editor - Admin Dashboard",
      description: "Comprehensive admin dashboard for managing users, subscriptions, orders, and system analytics in your SaaS application.",
      keywords: "admin, dashboard, management, SaaS, analytics, users, subscriptions, orders"
    },
    dashboard: {
      title: "Admin Dashboard",
      accessDenied: "Access Denied",
      noPermission: "You don't have permission to access the admin dashboard",
      lastUpdated: "Last updated",
      metrics: {
        totalRevenue: "Total Revenue",
        totalRevenueDesc: "All time revenue",
        newCustomers: "Monthly New Customers",
        newCustomersDesc: "New customers this month",
        newOrders: "Monthly New Orders",
        newOrdersDesc: "New orders this month",
        fromLastMonth: "from last month"
      },
      chart: {
        monthlyRevenueTrend: "Monthly Revenue Trend",
        revenue: "Revenue",
        orders: "Orders"
      },
      todayData: {
        title: "Today's Data",
        revenue: "Revenue",
        newUsers: "New Users",
        orders: "Orders"
      },
      monthData: {
        title: "This Month's Data",
        revenue: "Monthly Revenue",
        newUsers: "Monthly New Users",
        orders: "Monthly Orders"
      },
      recentOrders: {
        title: "Recent Orders",
        orderId: "Order ID",
        customer: "Customer",
        plan: "Plan",
        amount: "Amount",
        provider: "Payment Method",
        status: "Status",
        time: "Time",
        total: "Total"
      }
    },
    users: {
      title: "User Management",
      subtitle: "Manage users, roles, and permissions",
      actions: {
        addUser: "Add User",
        editUser: "Edit User",
        deleteUser: "Delete User",
        banUser: "Ban User",
        unbanUser: "Unban User"
      },
      table: {
        columns: {
          id: "ID",
          name: "Name",
          email: "Email",
          role: "Role",
          phoneNumber: "Phone Number",
          emailVerified: "Email Verified",
          banned: "Banned",
          referralCode: "Referral Code",
          referredByCode: "Referred By",
          commissionBalance: "Commission Balance",
          createdAt: "Created At",
          updatedAt: "Updated At",
          actions: "Actions"
        },
        actions: {
          editUser: "Edit User",
          deleteUser: "Delete User",
          clickToCopy: "Click to copy"
        },
        sort: {
          ascending: "Sort ascending",
          descending: "Sort descending",
          none: "Remove sorting"
        },
        noResults: "No users found",
        search: {
          searchBy: "Search by",
          searchPlaceholder: "Search {field}...",
          filterByRole: "Filter by role",
          allRoles: "All Roles",
          banStatus: "Ban status",
          allUsers: "All users",
          bannedUsers: "Banned",
          notBannedUsers: "Not banned",
          view: "View",
          toggleColumns: "Toggle columns"
        },
        pagination: {
          showing: "Showing {start} to {end} of {total} results",
          pageInfo: "Page {current} of {total}"
        },
        dialog: {
          banTitle: "Ban User",
          banDescription: "Are you sure you want to ban this user? They will not be able to access the application.",
          banSuccess: "User banned successfully",
          unbanSuccess: "User unbanned successfully",
          updateRoleSuccess: "User role updated successfully",
          updateRoleFailed: "Failed to update user role"
        }
      },
      banDialog: {
        title: "Ban User",
        description: "Are you sure you want to ban {userName}? They will not be able to access the application."
      },
      unbanDialog: {
        title: "Unban User",
        description: "Are you sure you want to unban {userName}? They will regain access to the application."
      },
      form: {
        title: "User Information",
        description: "Enter user details below",
        labels: {
          name: "Name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          role: "Role",
          image: "Profile Image",
          phoneNumber: "Phone Number",
          emailVerified: "Email Verified",
          phoneVerified: "Phone Verified",
          banned: "Banned",
          banReason: "Ban Reason",
          referralCode: "Referral Code",
          referredByCode: "Referred By",
          commissionBalance: "Commission Balance"
        },
        placeholders: {
          name: "Enter user's name",
          email: "Enter user's email",
          password: "Enter password (min 8 characters)",
          confirmPassword: "Confirm password",
          selectRole: "Select role",
          image: "https://example.com/avatar.jpg",
          phoneNumber: "Enter phone number",
          banReason: "Reason for banning (optional)"
        },
        validation: {
          nameRequired: "Name is required",
          emailRequired: "Email is required",
          emailInvalid: "Please enter a valid email",
          passwordRequired: "Password is required",
          passwordMinLength: "Password must be at least 8 characters",
          passwordMismatch: "Passwords do not match",
          roleRequired: "Role is required"
        }
      },
      deleteDialog: {
        title: "Delete User",
        description: "Are you absolutely sure? This action cannot be undone. This will permanently delete the user account and remove all associated data."
      },
      messages: {
        createSuccess: "User created successfully",
        updateSuccess: "User updated successfully",
        deleteSuccess: "User deleted successfully",
        deleteError: "Failed to delete user",
        fetchError: "Failed to fetch user data",
        operationFailed: "Operation failed"
      }
    },
    orders: {
      title: "Orders",
      actions: {
        createOrder: "Create Order"
      },
      messages: {
        fetchError: "Failed to load orders. Please try again."
      },
      table: {
        noResults: "No orders found.",
        search: {
          searchBy: "Search by...",
          searchPlaceholder: "Search by {field}...",
          filterByStatus: "Filter by status",
          allStatus: "All Status",
          filterByProvider: "Payment provider",
          allProviders: "All Providers",
          stripe: "Stripe",
          wechat: "WeChat",
          creem: "Creem",
          alipay: "Alipay",
          dodo: "Dodo Payments",
          waffo: "Waffo"
        },
        columns: {
          id: "Order ID",
          user: "User",
          amount: "Amount",
          plan: "Plan",
          status: "Status",
          provider: "Provider",
          providerOrderId: "Provider Order ID",
          createdAt: "Created At",
          actions: "Actions"
        },
        actions: {
          openMenu: "Open menu",
          actions: "Actions",
          viewOrder: "View order",
          refundOrder: "Refund order",
          clickToCopy: "Click to copy"
        },
        sort: {
          ascending: "Sort ascending",
          descending: "Sort descending",
          none: "Remove sorting"
        }
      },
      status: {
        pending: "Pending",
        paid: "Paid",
        failed: "Failed",
        refunded: "Refunded",
        canceled: "Canceled"
      }
    },
    blog: {
      title: "Blog Management",
      subtitle: "Create and manage blog posts",
      createPost: "Create Post",
      editPost: "Edit Post",
      actions: {
        newPost: "New Post"
      },
      messages: {
        fetchError: "Failed to load blog posts. Please try again.",
        createSuccess: "Post created successfully",
        updateSuccess: "Post updated successfully",
        deleteSuccess: "Post deleted successfully",
        deleteError: "Failed to delete post",
        operationFailed: "Operation failed",
        uploadSuccess: "Upload successful",
        uploadError: "Upload failed"
      },
      table: {
        noResults: "No posts found.",
        search: {
          searchPlaceholder: "Search by title...",
          filterByStatus: "Filter by status",
          allStatus: "All Status",
          draft: "Draft",
          published: "Published"
        },
        columns: {
          title: "Title",
          status: "Status",
          author: "Author",
          publishedAt: "Published At",
          createdAt: "Created At",
          actions: "Actions"
        },
        actions: {
          edit: "Edit",
          delete: "Delete"
        },
        sort: {
          ascending: "Sort ascending",
          descending: "Sort descending",
          none: "Remove sorting"
        }
      },
      form: {
        title: "Post Information",
        description: "Enter post details below",
        labels: {
          title: "Title",
          slug: "Slug",
          excerpt: "Excerpt",
          coverImage: "Cover Image",
          status: "Status",
          content: "Content"
        },
        placeholders: {
          title: "Enter post title",
          slug: "URL-friendly slug (auto-generated from title)",
          excerpt: "Brief summary of the post",
          coverImage: "Drag and drop or click to upload (max 2MB)",
          content: "Write your content in Markdown..."
        }
      },
      deleteDialog: {
        title: "Delete Post",
        description: "Are you absolutely sure? This action cannot be undone. This will permanently delete the post."
      }
    },
    credits: {
      title: "Credit Transactions",
      subtitle: "View all credit transactions across all users",
      messages: {
        fetchError: "Failed to load credit transactions. Please try again."
      },
      table: {
        noResults: "No credit transactions found.",
        search: {
          searchBy: "Search by...",
          searchPlaceholder: "Search by {field}...",
          filterByType: "Filter by type",
          allTypes: "All Types",
          purchase: "Purchase",
          consumption: "Consumption",
          refund: "Refund",
          bonus: "Bonus",
          adjustment: "Adjustment"
        },
        columns: {
          id: "Transaction ID",
          user: "User",
          type: "Type",
          amount: "Amount",
          balance: "Balance",
          description: "Description",
          createdAt: "Created At",
          metadata: "Metadata"
        },
        actions: {
          clickToCopy: "Click to copy",
          viewDetails: "View details"
        },
        sort: {
          ascending: "Sort ascending",
          descending: "Sort descending",
          none: "Remove sorting"
        },
        pagination: {
          showing: "Showing {start} to {end} of {total} results",
          pageInfo: "Page {current} of {total}"
        }
      },
      type: {
        purchase: "Purchase",
        consumption: "Consumption",
        refund: "Refund",
        bonus: "Bonus",
        adjustment: "Adjustment"
      }
    },
    subscriptions: {
      title: "Subscriptions",
      description: "Manage user subscriptions and billing",
      actions: {
        createSubscription: "Create Subscription"
      },
      messages: {
        fetchError: "Failed to load subscriptions. Please try again."
      },
      table: {
        showing: "Showing {from} to {to} of {total} results",
        noResults: "No subscriptions found.",
        rowsPerPage: "Rows per page",
        page: "Page",
        of: "of",
        view: "View",
        toggleColumns: "Toggle columns",
        goToFirstPage: "Go to first page",
        goToPreviousPage: "Go to previous page", 
        goToNextPage: "Go to next page",
        goToLastPage: "Go to last page",
        search: {
          searchLabel: "Search subscriptions",
          searchField: "Search field",
          statusLabel: "Status",
          providerLabel: "Provider",
          search: "Search",
          clear: "Clear",
          allStatuses: "All statuses",
          allProviders: "All providers",
          stripe: "Stripe",
          creem: "Creem",
          wechat: "WeChat",
          alipay: "Alipay",
          dodo: "Dodo Payments",
          waffo: "Waffo",
          userEmail: "User Email",
          subscriptionId: "Subscription ID",
          userId: "User ID",
          planId: "Plan ID",
          stripeSubscriptionId: "Stripe Subscription ID",
          creemSubscriptionId: "Creem Subscription ID",
          dodoSubscriptionId: "Dodo Subscription ID",
          waffoOrderId: "Waffo Order ID",
          placeholders: {
            userEmail: "Enter user email...",
            subscriptionId: "Enter subscription ID...",
            userId: "Enter user ID...",
            planId: "Enter plan ID...",
            stripeSubscriptionId: "Enter Stripe subscription ID...",
            creemSubscriptionId: "Enter Creem subscription ID...",
            dodoSubscriptionId: "Enter Dodo subscription ID...",
            waffoOrderId: "Enter Waffo order ID...",
            default: "Enter search term..."
          },
          searchBy: "Search by...",
          searchPlaceholder: "Search by {field}...",
          filterByStatus: "Filter by status",
          filterByProvider: "Filter by provider",
          allStatus: "All Status",
          filterByPaymentType: "Payment type",
          allPaymentTypes: "All Types",
          active: "Active",
          canceled: "Canceled",
          expired: "Expired",
          trialing: "Trialing",
          inactive: "Inactive",
          oneTime: "One Time",
          recurring: "Recurring"
        },
        columns: {
          id: "Subscription ID",
          user: "Customer",
          plan: "Plan",
          status: "Status",
          paymentType: "Payment Type",
          provider: "Provider",
          periodStart: "Period Start",
          periodEnd: "Period End",
          cancelAtPeriodEnd: "Will Cancel",
          createdAt: "Created",
          updatedAt: "Updated",
          metadata: "Metadata",
          period: "Period",
          actions: "Actions"
        },
        actions: {
          openMenu: "Open menu",
          actions: "Actions",
          viewSubscription: "View subscription",
          cancelSubscription: "Cancel subscription",
          clickToCopy: "Click to copy"
        },
        sort: {
          ascending: "Sort ascending",
          descending: "Sort descending",
          none: "Remove sorting"
        }
      },
      status: {
        active: "Active",
        trialing: "Trialing",
        canceled: "Canceled",
        cancelled: "Canceled",
        expired: "Expired",
        inactive: "Inactive"
      },
      paymentType: {
        one_time: "One-time",
        recurring: "Recurring"
      }
    },
    pricing: {
      title: "Pricing Plans",
      description: "Manage dynamic pricing plans for your application",
      createPlan: "Create Plan",
      editPlan: "Edit Plan",
      updatePlan: "Update Plan",
      importStatic: "Import from Config",
      importing: "Importing...",
      importSuccess: "Successfully imported plans from static config",
      importConfirm: "Import all static plans from config? This will not remove existing dynamic plans.",
      deletePlan: "Delete Plan",
      confirmDelete: "Are you sure you want to deactivate this plan?",
      noPlans: "No plans found. Create one or import from static config.",
      localeCoverageWarning: "Warning: Some locales have no active plans configured. Users in those locales will see an empty pricing page.",
      tabs: {
        subscription: "Subscription Plans",
        credits: "Credit Packs",
      },
      table: {
        name: "Name",
        provider: "Provider",
        price: "Price",
        type: "Type",
        locales: "Locales",
        status: "Status",
        actions: "Actions",
        allLocales: "All",
      },
      fields: {
        provider: "Provider",
        amount: "Amount",
        originalPrice: "Original Price (strikethrough)",
        currency: "Currency",
        durationType: "Duration Type",
        durationMonths: "Duration (months)",
        credits: "Credits",
        recommended: "Recommended",
        active: "Active",
        locales: "Locales",
        stripePriceId: "Stripe Price ID",
        paypalPlanId: "PayPal Plan ID",
        creemProductId: "Creem Product ID",
        dodoProductId: "Dodo Product ID",
        waffoProductId: "Waffo Product ID",
      },
      backToList: "Back to Plans",
      savePlan: "Save Plan",
      saving: "Saving...",
      sections: {
        planInfo: "Plan Information",
        planInfoDesc: "Define the plan name, description and features in each language",
        pricing: "Pricing",
        pricingDesc: "Set the payment provider, amount and pricing model",
        providerConfig: "Provider Configuration",
        providerConfigDesc: "Enter the product or price ID from your payment provider dashboard",
        noProviderConfig: "No additional provider ID required for this provider.",
        displaySettings: "Display Settings",
        displaySettingsDesc: "Control how and where this plan appears on the pricing page",
      },
      form: {
        providerIds: "Provider IDs",
        english: "English",
        chinese: "中文",
        name: "Name",
        description: "Description",
        durationLabel: "Duration Label",
        features: "Features (Markdown)",
        localesHint: "Comma-separated, leave empty to show to all",
        originalPricePlaceholder: "Leave empty for no discount",
        durationEnPlaceholder: "month / lifetime / one-time",
        durationZhPlaceholder: "月 / 终身 / 一次性",
        localesPlaceholder: "en, zh-CN",
      },
      mode: {
        static: "Static",
        dynamic: "Dynamic",
        switchWarning: "Switching pricing mode requires setting the PRICING_MODE environment variable and restarting the application.",
      },
    },
    commissions: {
      title: "Commission Records",
      description: "View all referral commission records",
      search: "Search by email...",
      noData: "No commission records found.",
      total: "total records",
      table: {
        referrer: "Referrer",
        buyer: "Buyer",
        orderAmount: "Order Amount",
        rate: "Rate",
        commission: "Commission",
        status: "Status",
        date: "Date",
        columns: {
          id: "ID",
          referrer: "Referrer",
          referrerEmail: "Referrer Email",
          referrerName: "Referrer Name",
          orderId: "Order ID",
          orderAmount: "Order Amount",
          rate: "Rate",
          commission: "Commission",
          status: "Status",
          date: "Date"
        },
        search: {
          searchBy: "Search by",
          searchPlaceholder: "Search {field}...",
          filterByStatus: "Filter by status"
        }
      },
      noResults: "No commission records found.",
      filter: {
        allStatus: "All Status",
        credited: "Credited",
        pending: "Pending",
        withdrawn: "Withdrawn",
        cancelled: "Cancelled",
        filterByStatus: "Filter by status"
      }
    },
    withdrawals: {
      title: "Withdrawal Requests",
      description: "Manage user withdrawal requests",
      search: "Search by email...",
      noData: "No withdrawal requests found.",
      total: "total requests",
      table: {
        user: "User",
        amount: "Amount",
        method: "Method",
        account: "Account",
        status: "Status",
        adminNote: "Admin Note",
        processedAt: "Processed At",
        processedBy: "Processed By",
        date: "Date",
        actions: "Actions",
        columns: {
          id: "ID",
          user: "User",
          userEmail: "User Email",
          userName: "User Name",
          amount: "Amount",
          method: "Method",
          paymentAccount: "Payment Account",
          status: "Status",
          adminNote: "Admin Note",
          processedAt: "Processed At",
          date: "Date",
          actions: "Actions"
        },
        search: {
          searchBy: "Search by",
          searchPlaceholder: "Search {field}...",
          filterByStatus: "Filter by status"
        }
      },
      noResults: "No withdrawal requests found.",
      actions: {
        approve: "Approve",
        reject: "Reject",
        markProcessing: "Mark Processing"
      },
      dialog: {
        title: "Process Withdrawal",
        note: "Admin Note",
        notePlaceholder: "Enter a note (optional)",
        confirm: "Confirm"
      },
      filter: {
        allStatus: "All Status",
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        rejected: "Rejected",
        filterByStatus: "Filter by status"
      }
    }
  },
  pricing: {
    metadata: {
      title: "AI Body Editor - Pricing Plans",
      description: "Choose the perfect plan for your needs. Flexible pricing options including monthly, yearly, and lifetime subscriptions with premium features.",
      keywords: "pricing, plans, subscription, monthly, yearly, lifetime, premium, features"
    },
    title: "Pricing",
    subtitle: "One integration, payments for both markets",
    description: "Domestic and international payment channels, all wired in out of the box. Time-based subscriptions or credit packs — pick the model that fits your business.",
    cta: "Get started",
    allProviders: "All",
    noPlans: "No plans of this type for the selected provider.",
    docsLink: "Read the payment docs",
    providers: {
      stripe: "Stripe",
      paypal: "PayPal",
      creem: "Creem",
      dodo: "Dodo",
      waffo: "Waffo",
      wechat: "WeChat Pay",
      alipay: "Alipay"
    },
    recommendedBadge: "Recommended",
    lifetimeBadge: "One-time purchase, lifetime access",
    creditsBadge: "Credits",
    creditsUnit: "credits",
    tabs: {
      subscription: "Subscription",
      credits: "Credits",
      affiliate: "Affiliate",
      withdrawal: "Withdrawal"
    },
    features: {
      securePayment: {
        title: "Multi-Provider Security",
        description: "Support WeChat Pay, Stripe, Creem with enterprise-grade security"
      },
      flexibleSubscription: {
        title: "Flexible Payment Models",
        description: "Time-based subscription or AI-era credit system — choose your style"
      },
      globalCoverage: {
        title: "Global Payment Coverage", 
        description: "Multi-currency and regional payment methods for worldwide access"
      }
    },
    plans: {
      monthly: {
        name: "Monthly Plan",
        description: "Perfect for short-term projects",
        duration: "month",
        features: {
          "所有高级功能": "All premium features",
          "优先支持": "Priority support"
        }
      },
      yearly: {
        name: "Annual Plan",
        description: "Best value for long-term use",
        duration: "year",
        features: {
          "所有高级功能": "All premium features",
          "优先支持": "Priority support",
          "两个月免费": "2 months free"
        }
      },
      lifetime: {
        name: "Lifetime",
        description: "One-time payment, lifetime access",
        duration: "lifetime",
        features: {
          "所有高级功能": "All premium features",
          "优先支持": "Priority support",
          "终身免费更新": "Free lifetime updates"
        }
      }
    }
  },
  payment: {
    metadata: {
      success: {
        title: "AI Body Editor - Payment Successful",
        description: "Your payment has been processed successfully. Thank you for your subscription and welcome to our premium features.",
        keywords: "payment, success, subscription, confirmation, premium"
      },
      cancel: {
        title: "AI Body Editor - Payment Cancelled",
        description: "Your payment was cancelled. You can retry the payment or contact our support team for assistance.",
        keywords: "payment, cancelled, retry, support, subscription"
      }
    },
    result: {
      success: {
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
        actions: {
          viewSubscription: "View Subscription",
          backToHome: "Back to Home"
        }
      },
      cancel: {
        title: "Payment Cancelled",
        description: "Your payment has been cancelled.",
        actions: {
          tryAgain: "Try Again",
          contactSupport: "Contact Support",
          backToHome: "Back to Home"
        }
      },
      failed: "Payment failed, please try again"
    },
    steps: {
      initiate: "Initialize",
      initiateDesc: "Prepare payment",
      scan: "Scan",
      scanDesc: "Scan QR code",
      pay: "Pay",
      payDesc: "Confirm payment"
    },
    scanQrCode: "Please scan the QR code with WeChat to complete the payment",
    confirmCancel: "Your payment is not complete. Are you sure you want to cancel?",
    orderCanceled: "Your order has been canceled"
  },
  subscription: {
    metadata: {
      title: "AI Body Editor - My Subscription",
      description: "Manage your subscription plan, view billing history, and update payment methods in your subscription dashboard.",
      keywords: "subscription, billing, payment, plan, management, dashboard"
    },
    title: "My Subscription",
    overview: {
      title: "Subscription Overview",
      planType: "Plan Type",
      status: "Status",
      active: "Active",
      startDate: "Start Date",
      endDate: "End Date",
      progress: "Subscription Progress"
    },
    management: {
      title: "Subscription Management",
      description: "Manage your subscription, view billing history, and update payment methods through the customer portal.",
      manageSubscription: "Manage Subscription",
      changePlan: "Change Plan",
      redirecting: "Redirecting..."
    },
    noSubscription: {
      title: "No Active Subscription Found",
      description: "You currently don't have an active subscription plan.",
      viewPlans: "View Plans"
    }
  },
  dashboard: {
    metadata: {
      title: "AI Body Editor - Dashboard",
      description: "Manage your account, subscriptions, and profile settings in your personalized dashboard.",
      keywords: "dashboard, account, profile, subscription, settings, management"
    },
    title: "Dashboard",
    description: "Manage your account and subscriptions",
    profile: {
      title: "Profile Information",
      noNameSet: "No name set",
      role: "Role:",
      emailVerified: "Email verified",
      editProfile: "Edit Profile",
      updateProfile: "Update Profile",
      cancel: "Cancel",
      form: {
        labels: {
          name: "Full Name",
          email: "Email Address",
          image: "Profile Image URL"
        },
        placeholders: {
          name: "Enter your full name",
          email: "Email address",
          image: "https://example.com/your-image.jpg"
        },
        emailReadonly: "Email address cannot be modified",
        imageDescription: "Optional: Enter a URL for your profile picture"
      },
      updateSuccess: "Profile updated successfully",
      updateError: "Failed to update profile. Please try again."
    },
    subscription: {
      title: "Subscription Status",
      status: {
        lifetime: "Lifetime",
        active: "Active",
        canceled: "Canceled",
        cancelAtPeriodEnd: "Canceling at Period End",
        pastDue: "Past Due",
        unknown: "Unknown",
        noSubscription: "No Subscription"
      },
      paymentType: {
        recurring: "Recurring",
        oneTime: "One-time"
      },
      lifetimeAccess: "You have lifetime access",
      expires: "Expires:",
      cancelingNote: "Your subscription will not renew and will end on:",
      noActiveSubscription: "You currently have no active subscription",
      manageSubscription: "Manage Subscription",
      viewPlans: "View Plans"
    },
    credits: {
      title: "Credit Balance",
      available: "Available Credits",
      totalPurchased: "Total Purchased",
      totalConsumed: "Total Used",
      recentTransactions: "Recent Transactions",
      buyMore: "Buy More Credits",
      types: {
        purchase: "Purchase",
        bonus: "Bonus",
        consumption: "Used",
        refund: "Refund",
        adjustment: "Adjustment"
      },
      descriptions: {
        ai_chat: "AI Chat",
        ai_image_generation: "AI Image Generation",
        ai_video_generation: "AI Video Generation",
        image_generation: "Image Generation",
        document_processing: "Document Processing",
        purchase: "Credit Purchase",
        bonus: "Bonus Credits",
        refund: "Credit Refund",
        adjustment: "Admin Adjustment",
        referral_signup_bonus: "Referral Signup Bonus",
        referral_referrer_bonus: "Referral Reward"
      },
      table: {
        type: "Type",
        description: "Description",
        amount: "Amount",
        time: "Time"
      }
    },
    affiliate: {
      title: "Affiliate Program",
      description: "Earn commissions by referring new users",
      referralLink: "Your Referral Link",
      copyLink: "Copy Link",
      copied: "Copied!",
      bonusFailed: "Referral applied, but the signup bonus could not be granted.",
      claimFailed: "Failed to claim referral code.",
      commissionBalance: "Commission Balance",
      commissionRate: "Commission Rate",
      totalCommission: "Total Earned",
      totalReferrals: "Total Referrals",
      paidReferrals: "Paid Referrals",
      signupBonus: "Signup Bonus",
      referrerBonus: "You get {amount} credits per referral signup",
      refereeBonus: "Referred users get {amount} credits",
      noReferrals: "No referrals yet",
      noCommissions: "No commissions yet",
      referralsTab: "Referrals",
      commissionsTab: "Commissions",
      table: {
        user: "User",
        email: "Email",
        joinDate: "Joined",
        buyer: "Buyer",
        orderAmount: "Order Amount",
        rate: "Rate",
        commission: "Commission",
        status: "Status",
        date: "Date"
      },
      status: {
        pending: "Pending",
        credited: "Credited",
        withdrawn: "Withdrawn",
        cancelled: "Cancelled"
      }
    },
    withdrawal: {
      title: "Withdrawal",
      description: "Withdraw your commission balance",
      balance: "Available Balance",
      amount: "Amount",
      amountPlaceholder: "Enter withdrawal amount",
      paymentMethod: "Payment Method",
      selectMethod: "Select payment method",
      paymentAccount: "Payment Account",
      accountPlaceholder: "Enter your payment account",
      submit: "Request Withdrawal",
      minAmount: "Minimum withdrawal amount: {amount}",
      history: "Withdrawal History",
      noHistory: "No withdrawal history",
      methods: {
        alipay: "Alipay",
        paypal: "PayPal",
        bank_transfer: "Bank Transfer"
      },
      status: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        rejected: "Rejected"
      },
      table: {
        amount: "Amount",
        method: "Method",
        account: "Account",
        status: "Status",
        date: "Date",
        note: "Note"
      }
    },
    account: {
      title: "Account Details",
      memberSince: "Member since",
      phoneNumber: "Phone Number"
    },
    orders: {
      title: "Order History",
      status: {
        pending: "Pending",
        paid: "Paid",
        failed: "Failed",
        refunded: "Refunded",
        canceled: "Canceled"
      },
      provider: {
        stripe: "Stripe",
        wechat: "WeChat Pay",
        creem: "Creem",
        alipay: "Alipay",
        dodo: "Dodo Payments",
        waffo: "Waffo"
      },
      noOrders: "No orders found",
      noOrdersDescription: "You haven't placed any orders yet",
      viewAllOrders: "View All Orders",
      orderDetails: {
        orderId: "Order ID",
        amount: "Amount",
        plan: "Plan",
        status: "Status",
        provider: "Payment Method",
        createdAt: "Created"
      },
      recent: {
        title: "Recent Orders",
        showingRecent: "Showing {count} most recent orders"
      },
      page: {
        title: "All Orders",
        description: "View and manage all your orders",
        backToDashboard: "Back to Dashboard",
        totalOrders: "Total {count} orders"
      }
    },
    linkedAccounts: {
      title: "Linked Accounts",
      connected: "Connected",
      connectedAt: "Connected:",
      noLinkedAccounts: "No linked accounts",
      providers: {
        credential: "Email & Password",
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
        apple: "Apple",
        discord: "Discord",
        wechat: "WeChat",
        "phone-number": "Phone Number"
      }
    },
    tabs: {
      profile: {
        title: "Profile",
        description: "Manage your personal information and avatar"
      },
      account: {
        title: "Account Management",
        description: "Password changes, linked accounts and security"
      },
      security: {
        title: "Security",
        description: "Password and security settings"
      },
      subscription: {
        description: "Manage your subscription plan and features"
      },
      credits: {
        title: "Credits",
        description: "View your credit balance and transactions"
      },
      orders: {
        description: "View your order history and transactions"
      },
      content: {
        profile: {
          title: "Profile",
          subtitle: "This is how others will see you on the site.",
          username: {
            label: "Username",
            value: "shadcn",
            description: "This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days."
          },
          email: {
            label: "Email",
            placeholder: "Select a verified email to display",
            description: "You can manage verified email addresses in your email settings."
          }
        },
        account: {
          title: "Account Settings",
          subtitle: "Manage your account settings and preferences.",
          placeholder: "Account settings content..."
        },
        security: {
          title: "Security Settings",
          subtitle: "Manage your password and security settings.",
          placeholder: "Security settings content..."
        }
      }
    },
    quickActions: {
      title: "Quick Actions",
      editProfile: "Edit Profile",
      accountSettings: "Account Settings",
      subscriptionDetails: "Subscription Details",
      getSupport: "Get Support",
      viewDocumentation: "View Documentation"
    },
    accountManagement: {
      title: "Account Management",
      changePassword: {
        title: "Change Password",
        description: "Update your account password",
        oauthDescription: "Password management is not available for social login accounts",
        button: "Change Password",
        dialogDescription: "Please enter your current password and choose a new one",
        form: {
          currentPassword: "Current Password",
          currentPasswordPlaceholder: "Enter your current password",
          newPassword: "New Password",
          newPasswordPlaceholder: "Enter new password (minimum 8 characters)",
          confirmPassword: "Confirm New Password",
          confirmPasswordPlaceholder: "Confirm your new password",
          cancel: "Cancel",
          submit: "Update Password"
        },
        success: "Password updated successfully",
        errors: {
          required: "Please fill in all required fields",
          mismatch: "New passwords do not match",
          minLength: "Password must be at least 8 characters long",
          failed: "Failed to update password. Please try again."
        }
      },
      deleteAccount: {
        title: "Delete Account",
        description: "Permanently delete your account and all associated data",
        button: "Delete Account",
        confirmTitle: "Delete Account",
        confirmDescription: "Are you absolutely sure you want to delete your account?",
        warning: "⚠️ This action cannot be undone",
        consequences: {
          data: "All your personal data will be permanently deleted",
          subscriptions: "Active subscriptions will be cancelled",
          access: "You will lose access to all premium features"
        },
        form: {
          cancel: "Cancel",
          confirm: "Yes, Delete My Account"
        },
        success: "Account deleted successfully",
        errors: {
          failed: "Failed to delete account. Please try again."
        }
      }
    },
    roles: {
      admin: "Administrator",
      user: "User"
    }
  },
  home: {
    metadata: {
      title: "AI Body Editor — Reshape & Slim Your Body in Photos Online",
      description: "Upload a photo and our AI body editor slims, adds muscle or adjusts body proportions in seconds. Try one edit free, no sign-up needed."
    },
    nav: {
      tryFree: "Try it free"
    },
    hero: {
      badge: "1 free edit · no sign-up",
      title: "AI Body Editor",
      subtitle: "Slim down, add muscle or rebalance your proportions in any photo. Upload a picture and the AI reshapes your body in seconds, while your face, clothes and background stay natural.",
      note: "Clothed photos only · Adults 18+ · Uploads are deleted after 8 hours"
    },
    upload: {
      inputLabel: "Upload a photo to edit",
      dropTitle: "Drop a photo here or click to upload",
      dropHint: "JPG, PNG or WebP · up to 10 MB",
      modeLabel: "Choose an edit",
      modes: {
        slim: "Slim",
        muscle: "Muscle",
        proportions: "Proportions"
      },
      submit: "Edit my photo",
      replace: "Choose another photo",
      previewAlt: "Preview of the photo you selected",
      errors: {
        type: "Please upload a JPG, PNG or WebP image.",
        size: "This photo is larger than 10 MB."
      },
      comingSoon: "The editor is launching soon. Your photo has not been uploaded."
    },
    features: {
      title: "What You Can Do",
      subtitle: "Four edits, each with a strength slider, so your results stay believable.",
      items: [
        {
          key: "slim",
          title: "Slim Body & Face",
          description: "Trim your waist, arms, thighs or jawline. Clothing, skin texture and the background stay intact, so the photo still looks real.",
          linkBefore: "Want a one-tap result? Try the ",
          linkText: "skinny filter",
          linkAfter: "."
        },
        {
          key: "muscle",
          title: "Add Muscle",
          description: "Add definition to your abs, chest, shoulders and arms, from a lightly toned look to a full athletic build.",
          linkBefore: "For control over each muscle group, open the ",
          linkText: "body editor",
          linkAfter: "."
        },
        {
          key: "proportions",
          title: "Body Proportions",
          description: "Lengthen legs, balance shoulders and hips or correct posture in full-body shots taken at awkward angles.",
          linkBefore: "Only want to adjust the bust? Use ",
          linkText: "AI breast expansion",
          linkAfter: " on clothed photos."
        },
        {
          key: "batch",
          title: "Batch Processing",
          description: "Apply the same edit to a whole set of photos in one go, ideal for a photoshoot or a dating profile gallery.",
          linkBefore: "Batch mode also works in the ",
          linkText: "body editor",
          linkAfter: ", so the same area settings apply to every photo in the set."
        }
      ]
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          title: "Upload a photo",
          description: "Choose a clear JPG, PNG or WebP photo of a clothed person, full-body or half-body."
        },
        {
          title: "Pick an edit and strength",
          description: "Select slim, muscle or proportions and drag the slider until it looks right."
        },
        {
          title: "Download the result",
          description: "Compare before and after, then save your edited photo in full resolution."
        }
      ]
    },
    action: {
      title: "See It in Action",
      subtitle: "Before and after examples for each type of edit.",
      before: "Before",
      after: "After",
      items: [
        {
          key: "slim",
          beforeAlt: "Before: woman in a floral summer dress standing on a beach, original photo",
          afterAlt: "After: the same woman with a slimmer waist and arms, beach background unchanged",
          caption: "Slim: waist and arms reduced, background untouched"
        },
        {
          key: "muscle",
          beforeAlt: "Before: man in a white tank top in a gym, original photo",
          afterAlt: "After: the same man with more defined arms, shoulders and chest, same gym lighting",
          caption: "Muscle: arms and chest defined, lighting unchanged"
        },
        {
          key: "proportions",
          beforeAlt: "Before: woman in jeans and a denim jacket, full-body street photo",
          afterAlt: "After: the same woman with longer legs and balanced proportions, street unchanged",
          caption: "Proportions: legs lengthened in a full-body shot"
        }
      ]
    },
    rating: {
      placeholder: "Rating placeholder (dev only): add real reviews before enabling aggregateRating."
    },
    why: {
      title: "Why aibodyeditor.net",
      items: [
        {
          title: "Try once, no sign-up",
          description: "Your first edit is free and needs no account or card. Create an account only if you like the result."
        },
        {
          title: "Natural, high-quality results",
          description: "The AI keeps skin texture, fabric and lighting realistic and exports in full resolution, so edits don't look warped or filtered."
        },
        {
          title: "Clothed photos only",
          description: "We accept clothed photos of adults only: nude images are rejected automatically and photos of anyone under 18 are not allowed. Uploads are never shared and are deleted after 8 hours."
        }
      ]
    },
    pricing: {
      title: "Pricing",
      subtitle: "No subscription. Buy credits once, they never expire, and each edit uses credits from your balance.",
      free: {
        name: "Free trial",
        detail: "1 edit, no sign-up"
      },
      packs: {
        starter: "Starter",
        pro: "Pro"
      },
      credits: "{credits} credits",
      neverExpire: "Credits never expire",
      comingSoon: "Price coming soon",
      ctaFree: "Try it free",
      ctaPack: "Get started"
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question: "Is there a free AI body editor?",
          answer: "Yes. aibodyeditor.net lets you edit one photo for free without creating an account. After that, you buy a credit pack once and use the credits whenever you want."
        },
        {
          question: "How can I make my body look slimmer in a photo?",
          answer: "Upload your photo, choose the Slim edit and drag the strength slider. The AI trims your waist, arms and thighs while keeping the background straight."
        },
        {
          question: "Can AI add muscle to a picture?",
          answer: "Yes. The Muscle edit adds definition to your abs, chest, shoulders and arms. You control the strength, from a lightly toned look to an athletic build."
        },
        {
          question: "Will the edited photo look natural?",
          answer: "The AI body editor reshapes the body only and keeps skin texture, clothing and lighting realistic. Lower strength settings give the most natural results."
        },
        {
          question: "Do I need a subscription?",
          answer: "No. There are no subscriptions. You buy credits once, they never expire, and each edit deducts credits from your balance."
        },
        {
          question: "Can I edit several photos at once?",
          answer: "Yes. Batch processing applies the same edit to a whole set of photos in one go. Each photo in the batch uses credits."
        },
        {
          question: "Is it safe to upload my photos?",
          answer: "Your photos are never shared and are deleted from our servers after 8 hours. You must be 18 or older to use the site, and we accept clothed photos of adults only, automatically rejecting nude images."
        },
        {
          question: "Does the AI body editor work on iPhone and Android?",
          answer: "Yes. It runs in any modern mobile or desktop browser, so there is nothing to install."
        }
      ]
    },
    tools: {
      title: "More AI Photo Tools",
      items: [
        {
          key: "bodyEditor",
          title: "Body Editor",
          description: "Reshape any body area by hand with precise sliders."
        },
        {
          key: "skinnyFilter",
          title: "Skinny Filter",
          description: "Slim your whole body in one tap."
        },
        {
          key: "breastExpansion",
          title: "AI Breast Expansion",
          description: "Adjust bust proportions on clothed photos."
        }
      ]
    },
    footer: {
      copyright: "© {year} AI Body Editor. All rights reserved.",
      toolsTitle: "Tools",
      siteNavLabel: "Site navigation",
      homeLinkText: "AI Body Editor"
    }
  },
  toolPages: {
    common: {
      breadcrumbLabel: "Breadcrumb",
      homeName: "AI Body Editor",
      relatedTitle: "Related Tools",
      homeLinkText: "AI body editor",
      homeLinkDescription: "Ready-made slim, muscle and proportion edits for the whole body in one click."
    },
    bodyEditor: {
      keyword: "body editor",
      metadata: {
        title: "Body Editor — Free Online AI Body Reshape Tool",
        description: "Reshape your waist, hips, legs, arms or shoulders in any photo with an online body editor. Try one edit free, no sign-up needed."
      },
      breadcrumb: "Body Editor",
      hero: {
        title: "Body Editor",
        subtitle: "Reshape your body in a photo one area at a time. Choose the waist, hips, legs, arms or shoulders, move a slider and watch the change, while walls and door frames behind you stay straight.",
        note: "1 free edit, no sign-up · Clothed photos only · Uploads deleted after 8 hours"
      },
      what: {
        title: "What Is a Body Editor?",
        paragraphs: [
          "A body editor is a photo tool that changes the shape of the person in a picture without changing anything else. Instead of putting one filter over the whole image, you choose a specific area, such as the waist, hips, thighs, arms or shoulders, and decide exactly how much it should move.",
          "Most people reach for a body editor because the camera did not show them the way they look in real life. A wide-angle phone lens makes whatever is closest to it look larger, a low angle shortens the legs, and a slouch that lasted one second can end up in the only good shot from a wedding. Editing those areas back is often more honest than leaving the distortion in.",
          "There are practical uses too. Personal trainers sketch a realistic goal physique to show a client what twelve weeks of work could look like. Online clothing sellers keep product photos consistent when models of different builds wear the same item.",
          "Older body editing apps worked by stretching pixels, so every change bent the door frame, the tiled floor or the horizon next to the body. This body editor uses AI to find where the person ends and the background begins. It reshapes only the body and rebuilds the background behind it, so the edited photo still looks like a real photo."
        ],
        linkBefore: "Prefer one click to manual control? Our ",
        linkAfter: " applies ready-made slim, muscle and proportion edits to the whole body at once.",
        sibling: {
          key: "skinnyFilter",
          before: "Only after an overall slimmer look? The ",
          after: " slims your face, arms, waist and legs together with one slider."
        },
        figure: {
          beforeAlt: "Before: woman in a black dress standing in a doorway, original full-body photo",
          afterAlt: "After: the same woman with a narrower waist and hips, door frame behind her still straight",
          caption: "Waist and hips adjusted with the body editor. The door frame behind her stays straight."
        }
      },
      howTo: {
        title: "How to Edit Your Body in a Photo",
        steps: [
          {
            title: "Upload a clear photo",
            description: "Pick a well-lit JPG, PNG or WebP photo where the person is clothed and the area you want to change is fully visible."
          },
          {
            title: "Select the body area",
            description: "Choose the waist, hips, legs, arms, shoulders or chest, or combine several areas in a single edit."
          },
          {
            title: "Adjust the slider",
            description: "Drag the strength slider and switch between before and after until the change looks natural."
          },
          {
            title: "Download your photo",
            description: "Save the edited image in full resolution, ready for social media, a dating profile or a portfolio."
          }
        ]
      },
      tips: {
        title: "Body Editor Tips",
        items: [
          {
            title: "Stay within 10–20% per area",
            description: "Small changes read as natural. A large change to one area makes the rest of the body look out of proportion, so build up gradually and compare with the original often."
          },
          {
            title: "Check straight lines next to the body",
            description: "Look at walls, railings, stripes and clothing seams beside the area you edited. If any of them curve, lower the strength or select a slightly smaller area."
          },
          {
            title: "Edit a photo set the same way",
            description: "When you edit several photos from one shoot, use the same areas and strengths on every picture so the person looks consistent across the whole set."
          }
        ]
      },
      faq: {
        title: "FAQ",
        items: [
          {
            question: "Is this body editor free?",
            answer: "Yes, you can make one edit for free without signing up. After that, edits use credits, which you buy once and which never expire."
          },
          {
            question: "Can I edit my body in a photo without downloading an app?",
            answer: "Yes. The body editor runs in your web browser on iPhone, Android and desktop, so there is nothing to install."
          },
          {
            question: "Which parts of the body can I reshape?",
            answer: "You can adjust the waist, hips, legs, arms, shoulders and chest. Each area has its own slider, so you can change one part without affecting the others."
          },
          {
            question: "Will the background get distorted when I reshape my body?",
            answer: "The AI separates the person from the background before reshaping and then fills in the area behind the body. Straight lines such as walls and door frames stay straight in most photos."
          },
          {
            question: "Does the body editor work on half-body photos?",
            answer: "Yes. Half-body photos work well for the arms, shoulders and waist. For legs and overall proportions, use a full-body photo."
          },
          {
            question: "Can I edit a photo of someone else?",
            answer: "Only edit photos of other people with their permission. The body editor accepts clothed photos only and rejects nude or explicit images."
          },
          {
            question: "What happens to my photo after I edit it?",
            answer: "Your photo is used only to create your edit. It is deleted from our servers after 8 hours."
          }
        ]
      },
      related: {
        description: "Reshape any body area by hand with its own slider."
      }
    },
    skinnyFilter: {
      keyword: "skinny filter",
      metadata: {
        title: "Skinny Filter — Slim Your Whole Body in a Photo in One Tap",
        description: "This skinny filter slims your face, arms, waist and legs in a photo with one slider, without warping the background. Try one edit free, no sign-up."
      },
      breadcrumb: "Skinny Filter",
      hero: {
        title: "Skinny Filter",
        subtitle: "Slim your whole body in a photo with a single slider. The AI trims your face, arms, waist and legs together, so you look slimmer while your proportions and the background stay just as they were.",
        note: "1 free edit, no sign-up · Clothed photos only · Uploads deleted after 8 hours"
      },
      what: {
        title: "What Is a Skinny Filter?",
        paragraphs: [
          "A skinny filter is a one-step photo effect that makes a person look slimmer. Rather than asking you to work on each part of the body, it reduces the face, neck, arms, waist and legs at the same time and by the same amount. Because everything changes together, the person keeps their natural proportions and still looks like themselves.",
          "Skinny filters became popular on social apps, where they run live on the camera feed. Most of those filters take a shortcut: they squeeze the middle of the frame. The person gets thinner, but so do the mirror, the window and the friend standing next to them. Bent doorways and oval clocks are the classic signs that a photo went through a skinny filter.",
          "This skinny filter works on still photos and handles the person and the background separately. The AI traces the outline of the body, slims it with one strength setting and then rebuilds the part of the scene that was hidden behind it. Clothing keeps its folds and prints, the face keeps its features, and furniture and walls around you stay where they were.",
          "A single control also makes it the quickest way to get an overall slimmer look, whether you are updating a profile picture, sharing holiday photos or fixing a portrait where a wide-angle phone lens added a few pounds."
        ],
        linkBefore: "Looking for more than slimming, such as adding muscle or changing proportions? Head back to the ",
        linkAfter: ".",
        sibling: {
          key: "bodyEditor",
          before: "Want to change just one area, like your waist or arms, and leave the rest alone? The ",
          after: " gives each body area its own slider."
        },
        figure: {
          beforeAlt: "Before: man in a navy polo shirt sitting at a café table, original photo",
          afterAlt: "After: the same man with a slimmer face, arms and waist, café chairs and window frame unchanged",
          caption: "Skinny filter at medium strength: face, arms and waist slimmed together, background untouched."
        }
      },
      howTo: {
        title: "How to Use a Skinny Filter on a Photo",
        steps: [
          {
            title: "Upload your photo",
            description: "Add a clear photo of a clothed person in JPG, PNG or WebP. Close-up portraits and full-body shots both work."
          },
          {
            title: "Set the strength",
            description: "Move the single strength slider. A low setting is usually enough for a slimmer look that still reads as natural."
          },
          {
            title: "Compare before and after",
            description: "Switch between the original and the filtered photo and check the face, hands and edges of the body."
          },
          {
            title: "Save and share",
            description: "Download the slimmed photo in full resolution and post it wherever you like."
          }
        ]
      },
      tips: {
        title: "Skinny Filter Tips",
        items: [
          {
            title: "Use the lowest strength that works",
            description: "A skinny filter changes the whole body at once, so even a low setting makes a clear difference. If people who know you would spot the change at a glance, turn it down."
          },
          {
            title: "Leave space around the body",
            description: "Avoid tight crops where arms or legs touch the edge of the frame. The AI needs some visible background around the body to rebuild the edges cleanly."
          },
          {
            title: "Watch the face first",
            description: "The face is where too much slimming shows soonest. If your face starts to look like someone else's, lower the strength before you touch anything else."
          }
        ]
      },
      faq: {
        title: "FAQ",
        items: [
          {
            question: "Is there a free skinny filter for photos?",
            answer: "Yes. You can apply the skinny filter to one photo for free without creating an account. More edits use credits, which you buy once and which never expire."
          },
          {
            question: "How do I make myself look skinnier in a picture?",
            answer: "Upload the photo, set the strength of the skinny filter and download the result. The filter slims your face, arms, waist and legs together, so your proportions stay balanced."
          },
          {
            question: "Is this the same as the skinny filter on TikTok or Snapchat?",
            answer: "No. Those filters run live on video and usually stretch the whole frame, which bends the background. This skinny filter works on still photos and slims only the person, so walls and furniture behind you stay straight."
          },
          {
            question: "Can I use the skinny filter on a video?",
            answer: "No, it works on photos only. If you have several photos to slim, batch processing applies the filter to all of them in one go."
          },
          {
            question: "Will the skinny filter make my photo look fake?",
            answer: "Not at low or medium strength. The AI keeps skin texture, clothing prints and the background intact, which avoids the usual signs of editing. Very high settings can look unnatural, so compare with the original before saving."
          },
          {
            question: "Does the skinny filter work for men?",
            answer: "Yes. It works on any clothed person, whatever their gender or body type."
          },
          {
            question: "Can I upload nude photos?",
            answer: "No. The skinny filter accepts clothed photos only and automatically rejects nude or explicit images. All uploads are deleted after 8 hours."
          }
        ]
      },
      related: {
        description: "Slim your whole body in a photo with one slider."
      }
    },
    breastExpansion: {
      keyword: "AI breast expansion",
      metadata: {
        title: "AI Breast Expansion — Balance Bust Proportions in Photos",
        description: "Use AI breast expansion to adjust bust size and balance your silhouette in clothed photos, with fabric and fit kept realistic. Try one edit free, no sign-up."
      },
      breadcrumb: "AI Breast Expansion",
      hero: {
        title: "AI Breast Expansion",
        subtitle: "Adjust bust size in a clothed photo to balance your proportions or preview how an outfit fits a fuller silhouette. The AI redraws the fabric to match, so seams, prints and necklines still look right.",
        note: "1 free edit, no sign-up · Clothed photos only · Adults 18+ · Uploads deleted after 8 hours"
      },
      what: {
        title: "What Is AI Breast Expansion?",
        paragraphs: [
          "AI breast expansion is a photo edit that makes the bust look fuller in a picture of a clothed person and adjusts the clothing to match. It is a proportion tool: it changes the silhouette under a top or dress while keeping the fabric, neckline and fit believable, instead of inventing a different body.",
          "The most common reason people use it is balance. A high camera angle, a loose top or a strong waist edit can leave the upper body looking flat next to the hips and shoulders. A small bust adjustment brings back the hourglass or pear-shaped outline the person actually has, or the one they want to show in a styled photo.",
          "It also works as a fitting preview. Shoppers use it to see how a wrap dress or a tailored blazer would sit on a fuller bust before they order. Clothing brands use it to show one garment on several body shapes without booking another shoot, and some people use it privately to picture a cosmetic procedure they are considering before they speak to a surgeon.",
          "Because only clothed photos are accepted, the real work for the AI is understanding fabric. It redraws how the material stretches, folds and casts shadows over a fuller bust, so a striped shirt keeps its stripes and a row of buttons stays in line. It never removes clothing, and photos without clothing or of anyone under 18 are rejected."
        ],
        linkBefore: "Want to adjust your waist, legs or overall shape at the same time? Start from the ",
        linkAfter: ".",
        sibling: {
          key: "bodyEditor",
          before: "To reshape other individual areas, such as the hips or shoulders, use the ",
          after: " and its per-area sliders."
        },
        figure: {
          beforeAlt: "Before: woman in a striped knit top standing in a clothing store, original photo",
          afterAlt: "After: the same woman with a fuller bust, the knit stripes following the new shape, store background unchanged",
          caption: "Bust adjusted at low strength: the stripes of the top bend naturally with the new shape."
        }
      },
      howTo: {
        title: "How to Use AI Breast Expansion on a Photo",
        steps: [
          {
            title: "Upload a clothed photo",
            description: "Use a clear JPG, PNG or WebP photo of yourself, fully clothed, with your upper body facing the camera."
          },
          {
            title: "Set the size change",
            description: "Move the slider to choose how much fuller the bust should look. Start low and increase in small steps."
          },
          {
            title: "Check the clothing",
            description: "Compare before and after and look at seams, buttons and the neckline to make sure the garment still fits naturally."
          },
          {
            title: "Download the result",
            description: "Save the edited photo in full resolution for your own use."
          }
        ]
      },
      tips: {
        title: "AI Breast Expansion Tips",
        items: [
          {
            title: "Pick fitted clothing",
            description: "Fitted tops and dresses give the AI clear lines to follow. Very loose or layered clothing hides the silhouette and makes the change harder to judge."
          },
          {
            title: "Balance the whole silhouette",
            description: "A fuller bust can make the shoulders look narrow or the hips look small. If the outfit starts to look top-heavy, adjust those areas as well so the proportions stay even."
          },
          {
            title: "Stay within the person's frame",
            description: "Sizes far beyond what the body and the garment could carry strain the fabric in ways that look edited. Small steps keep the clothing believable."
          }
        ]
      },
      faq: {
        title: "FAQ",
        items: [
          {
            question: "Is AI breast expansion free to try?",
            answer: "Yes. Your first edit is free and needs no account. After that, each edit is paid with credits from a pack you buy once, and unused credits stay in your balance for good."
          },
          {
            question: "How can I make my bust look bigger in a photo?",
            answer: "Upload a clothed photo, set the size slider and compare before and after. The AI makes the bust fuller and redraws the clothing so the fit still looks natural."
          },
          {
            question: "Does AI breast expansion work on nude photos?",
            answer: "No. It accepts clothed photos only and automatically rejects nude or explicit images. It never removes clothing."
          },
          {
            question: "Can I use it to preview a breast augmentation?",
            answer: "It can give you a rough idea of how a fuller silhouette looks in your own clothes. It is not a medical simulation, so discuss realistic results with a qualified surgeon."
          },
          {
            question: "Is it okay to edit a friend's photo?",
            answer: "Only with their clear permission. Photos of anyone under 18 are not allowed, and editing other people's photos without consent is against our rules."
          },
          {
            question: "Will the clothes still look real after the edit?",
            answer: "Yes, at moderate settings. The AI follows the garment's seams, prints and shadows, so patterns bend with the new shape instead of breaking."
          },
          {
            question: "How long do you keep my photo?",
            answer: "Only as long as it takes to finish your edit. Every upload is removed automatically 8 hours later."
          }
        ]
      },
      related: {
        description: "Balance bust proportions in clothed photos."
      }
    }
  },
  notFound: {
    metadata: {
      title: "Page not found – AI Body Editor",
      description: "The page you are looking for does not exist."
    },
    title: "Page not found",
    description: "The page you are looking for does not exist or has been moved.",
    backHome: "Back to home"
  },
  ai: {
    metadata: {
      title: "AI Body Editor - AI Assistant",
      description: "Interact with powerful AI models including GPT-4, Qwen, and DeepSeek. Get AI assistance for coding, writing, and problem-solving.",
      keywords: "AI, assistant, chatbot, GPT-4, artificial intelligence, machine learning, conversation"
    },
    chat: {
      title: "AI Assistant",
      description: "A simple implementation of large model conversation with extensible design, using the latest technologies ai-sdk / ai-elements / streamdown to achieve very smooth chat effects, can be extended to more complex functions as needed",
      placeholder: "What can I help you with?",
      sending: "Sending...",
      thinking: "AI is thinking...",
      noMessages: "Start a conversation with the AI assistant",
      welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
      toolCall: "Tool Call",
      providers: {
        title: "AI Provider",
        openai: "OpenAI",
        qwen: "Qwen",
        deepseek: "DeepSeek"
      },
      models: {
        "gpt-5.6-sol": "GPT-5.6 Sol",
        "gpt-5.6-terra": "GPT-5.6 Terra",
        "gpt-5.6-luna": "GPT-5.6 Luna",
        "qwen3.8-max": "Qwen 3.8 Max",
        "qwen3.7-plus": "Qwen 3.7 Plus",
        "qwen3.7-flash": "Qwen 3.7 Flash",
        "deepseek-v4-pro": "DeepSeek V4 Pro",
        "deepseek-v4-flash": "DeepSeek V4 Flash"
      },
      actions: {
        send: "Send",
        copy: "Copy",
        copied: "Copied!",
        retry: "Retry",
        dismiss: "Dismiss",
        newChat: "New Chat",
        clearHistory: "Clear History"
      },
      errors: {
        failedToSend: "Failed to send message. Please try again.",
        networkError: "Network error. Please check your connection.",
        invalidResponse: "Invalid response from AI. Please try again.",
        rateLimited: "Too many requests. Please wait a moment.",
        subscriptionRequired: "AI features require an active subscription",
        subscriptionRequiredDescription: "Upgrade to a premium plan to access AI chat features",
        insufficientCredits: "Insufficient Credits",
        insufficientCreditsDescription: "You need credits or a subscription to use AI chat. Purchase credits to continue."
      },
      history: {
        title: "Chat History",
        empty: "No chat history",
        today: "Today",
        yesterday: "Yesterday",
        thisWeek: "This Week",
        older: "Older"
      }
    },
    image: {
      metadata: {
        title: "AI Body Editor - AI Image Generation",
        description: "Generate stunning images using AI. Powered by Qwen-Image 3.0, fal.ai, OpenAI GPT Image 2, and Google Gemini.",
        keywords: "AI, image generation, DALL-E, Flux, Qwen, Gemini, text to image, art, creative"
      },
      title: "AI Image Generation",
      description: "Generate stunning images from text prompts using multiple AI providers",
      defaultPrompt: "A yellow Labrador wearing black and gold round sunglasses drinking tea with two yellow and white cats in a venue in Chengdu",
      prompt: "Prompt",
      promptPlaceholder: "Describe the image you want to generate...",
      negativePrompt: "Negative Prompt",
      negativePromptPlaceholder: "Describe what you don't want in the image...",
      negativePromptHint: "Describe elements to avoid in the generated image",
      generate: "Generate",
      generating: "Generating...",
      generatedSuccessfully: "Image generated successfully!",
      download: "Download",
      result: "Result",
      idle: "Idle",
      preview: "Preview",
      json: "JSON",
      whatNext: "What would you like to do next?",
      costInfo: "Your request will cost",
      perMegapixel: "per megapixel",
      credits: "credits",
      providers: {
        title: "Provider",
        qwen: "Aliyun BaiLian",
        fal: "fal.ai",
        openai: "OpenAI",
        gemini: "Google Gemini"
      },
      models: {
        "qwen-image-3.0-pro": "Qwen Image 3.0 Pro",
        "qwen-image-3.0": "Qwen Image 3.0",
        "reve/2.1/text-to-image": "Reve 2.1",
        "bytedance/seedream/v5/pro/text-to-image": "Seedream 5.0 Pro",
        "fal-ai/flux-2-pro": "FLUX.2 Pro",
        "gpt-image-2": "GPT Image 2",
        "gemini-3.1-flash-image-preview": "Nano Banana 2",
        "gemini-3-pro-image-preview": "Nano Banana Pro"
      },
      settings: {
        title: "Additional Settings",
        showMore: "More",
        showLess: "Less",
        imageSize: "Image Size",
        imageSizeHint: "Select the aspect ratio and resolution",
        numInferenceSteps: "Num Inference Steps",
        numInferenceStepsHint: "More steps = higher quality but slower",
        guidanceScale: "Guidance Scale",
        guidanceScaleHint: "How closely to follow the prompt",
        seed: "Seed",
        seedHint: "Use the same seed to reproduce results",
        random: "random",
        randomize: "Randomize",
        promptExtend: "Prompt Extend",
        promptExtendHint: "AI will enhance and expand your prompt",
        watermark: "Watermark",
        watermarkHint: "Add Qwen-Image watermark to the generated image",
        syncMode: "Sync Mode",
        syncModeHint: "Return base64 data instead of URL"
      },
      errors: {
        generationFailed: "Image generation failed",
        invalidPrompt: "Please enter a valid prompt",
        insufficientCredits: "Insufficient Credits",
        insufficientCreditsDescription: "You need credits to generate images. Purchase credits to continue.",
        networkError: "Network error. Please check your connection.",
        unknownError: "An unknown error occurred"
      }
    },
    video: {
      metadata: {
        title: "AI Body Editor - AI Video Generation",
        description: "Generate stunning videos using AI. Powered by fal.ai, Volcengine Seedance, and Aliyun Wanxiang.",
        keywords: "AI, video generation, text to video, Seedance, Wanxiang, Luma, creative"
      },
      title: "AI Video Generation",
      description: "Generate stunning videos from text prompts using multiple AI providers",
      defaultPrompt: "A cat jumps directly from someone's lap onto the sofa",
      prompt: "Prompt",
      model: "Model",
      promptPlaceholder: "Describe the video you want to generate...",
      generate: "Generate Video",
      generating: "Generating video...",
      generatedSuccessfully: "Video generated successfully!",
      download: "Download Video",
      result: "Result",
      idle: "Enter a prompt to generate a video",
      whatNext: "What would you like to do next?",
      credits: "Credits",
      providers: {
        title: "Provider",
        fal: "fal.ai",
        volcengine: "Volcengine",
        aliyun: "Aliyun Wanxiang"
      },
      models: {
        "fal-ai/kling-video/v3/pro/text-to-video": "Kling 3.0 Pro (Text to Video)",
        "fal-ai/kling-video/v3/pro/image-to-video": "Kling 3.0 Pro (Image to Video)",
        "fal-ai/veo3.1": "Veo 3.1 (Text to Video)",
        "fal-ai/veo3.1/image-to-video": "Veo 3.1 (Image to Video)",
        "doubao-seedance-2-5-260628": "Doubao Seedance 2.5",
        "doubao-seedance-2-0-260128": "Doubao Seedance 2.0",
        "wan3.0-video": "Wan 3.0",
        "wan3.0-video-prime": "Wan 3.0 Prime"
      },
      inputMode: {
        label: "Generation Mode",
        text: "Text to Video",
        firstFrame: "First Frame",
        firstLastFrame: "First + Last Frame",
        firstLastFrameUnsupported: "Current provider supports first frame only"
      },
      frameInput: {
        title: "Frame Images",
        hint: "Use URL directly, or upload to Cloudflare R2.",
        firstFrameUrl: "First Frame URL",
        lastFrameUrl: "Last Frame URL",
        upload: "Upload",
        uploadedToR2: "Frame uploaded to R2",
        preview: "Image Preview",
        previewAlt: "First frame preview"
      },
      settings: {
        title: "Additional Settings",
        videoSize: "Video Size / Aspect Ratio",
        videoSizePlaceholder: "Select size",
        videoSizeHint: "Select the resolution or aspect ratio",
        duration: "Duration (seconds)",
        durationHint: "Length of the generated video",
        seed: "Seed",
        seedHint: "Use the same seed to reproduce results",
        random: "random",
        loop: "Loop",
        loopHint: "Whether the video should loop seamlessly",
        motionStrength: "Motion Strength",
        motionStrengthHint: "Controls how much motion appears in the video",
        promptExtend: "Prompt Extend",
        promptExtendHint: "AI will enhance and expand your prompt",
        watermark: "Watermark",
        watermarkHint: "Add watermark to the generated video"
      },
      errors: {
        generationFailed: "Video generation failed",
        invalidPrompt: "Please enter a valid prompt",
        firstFrameRequired: "Please provide a first frame URL",
        lastFrameRequired: "Please provide a last frame URL",
        unsupportedImageType: "Only JPEG/JPG/PNG/WEBP/BMP images are supported",
        imageTooLarge: "Image size must be less than or equal to 10MB",
        uploadFailed: "Upload failed",
        unsupportedModeForProvider: "Current provider does not support this generation mode",
        insufficientCredits: "Insufficient Credits",
        insufficientCreditsDescription: "You need credits to generate videos. Purchase credits to continue.",
        networkError: "Network error. Please check your connection.",
        unknownError: "An unknown error occurred",
        timeout: "Video generation timed out. Please try again."
      },
      resultPanel: {
        generatingHint: "Video generation may take 1-5 minutes...",
        videoTagUnsupported: "Your browser does not support the video tag."
      }
    }
  },
  premiumFeatures: {
    metadata: {
      title: "AI Body Editor - Premium Features",
      description: "Explore all the premium features available with your subscription. Access advanced tools, AI assistance, and enhanced functionality.",
      keywords: "premium, features, advanced, tools, subscription, benefits, enhanced"
    },
    title: "Premium Features",
    description: "Thank you for your subscription! Here are all the premium features you can now access.",
    loading: "Loading...",
    subscription: {
      title: "Your Subscription",
      description: "Current subscription status and details",
      status: "Subscription Status",
      type: "Subscription Type",
      expiresAt: "Expires At",
      active: "Active",
      inactive: "Inactive",
      lifetime: "Lifetime Member",
      recurring: "Recurring Subscription"
    },
    badges: {
      lifetime: "Lifetime Member"
    },
    demoNotice: {
      title: "🎯 SaaS Template Demo Page",
      description: "This is a demo page for testing route protection. Only paying users can access this page, demonstrating how to implement subscription-level access control in your SaaS application."
    },
    features: {
      userManagement: {
        title: "Advanced User Management",
        description: "Complete user profile management and custom settings"
      },
      aiAssistant: {
        title: "AI Smart Assistant",
        description: "Advanced artificial intelligence features to boost productivity"
      },
      documentProcessing: {
        title: "Unlimited Document Processing",
        description: "Process any number and size of document files"
      },
      dataAnalytics: {
        title: "Detailed Data Analytics",
        description: "In-depth data analysis and visualization reports"
      }
    },
    actions: {
      accessFeature: "Access Feature"
    }
  },
  validators: {
    user: {
      name: {
        minLength: "Name must be at least {min} characters",
        maxLength: "Name must be less than {max} characters"
      },
      email: {
        invalid: "Please enter a valid email address"
      },
      image: {
        invalidUrl: "Please enter a valid URL"
      },
      password: {
        minLength: "Password must be at least {min} characters",
        maxLength: "Password must be less than {max} characters",
        mismatch: "Passwords don't match"
      },
      countryCode: {
        required: "Please select country/region"
      },
      phoneNumber: {
        required: "Please enter phone number",
        invalid: "Invalid phone number format"
      },
      verificationCode: {
        invalidLength: "Verification code must be {length} characters"
      },
      id: {
        required: "User ID is required"
      },
      currentPassword: {
        required: "Current password is required"
      },
      confirmPassword: {
        required: "Please confirm your password"
      },
      deleteAccount: {
        confirmRequired: "You must confirm account deletion"
      }
    },
    blog: {
      title: {
        required: "Title is required",
        maxLength: "Title must be less than {max} characters",
      },
      slug: {
        maxLength: "Slug must be less than {max} characters",
        invalid: "Slug can only contain lowercase letters, numbers, and hyphens",
      },
      excerpt: {
        maxLength: "Excerpt must be less than {max} characters",
      },
      coverImage: {
        invalidUrl: "Please enter a valid URL for the cover image",
      },
      status: {
        invalid: "Status must be either draft or published",
      },
    },
    withdrawal: {
      amount: {
        required: "Please enter the withdrawal amount",
        positive: "Amount must be greater than 0",
      },
      paymentMethod: {
        required: "Please select a payment method",
      },
      paymentAccount: {
        required: "Please enter your payment account",
        maxLength: "Payment account must be less than {max} characters",
      },
    },
  },
  countries: {
    china: "China",
    usa: "United States",
    uk: "United Kingdom",
    japan: "Japan",
    korea: "South Korea",
    singapore: "Singapore",
    hongkong: "Hong Kong",
    macau: "Macau",
    australia: "Australia",
    france: "France",
    germany: "Germany",
    india: "India",
    malaysia: "Malaysia",
    thailand: "Thailand"
  },
  header: {
    navigation: {
      ai: "AI Demo",
      premiumFeatures: "Premium Features",
      pricing: "Pricing",
      upload: "Upload",
      demos: "Demos",
      demosDescription: "Explore example features",
      blog: "Blog",
      affiliate: "Affiliate"
    },
    demos: {
      ai: {
        title: "AI Chat",
        description: "LLM chat with extensible design, multi-provider support. Login required."
      },
      aiImage: {
        title: "AI Image Generation",
        description: "AI image generation with extensible design, multi-provider support. Login required."
      },
      aiVideo: {
        title: "AI Video Generation",
        description: "AI video generation with extensible design, multi-provider support. Login required."
      },
      premium: {
        title: "Premium Features",
        description: "Route protection demo. Only paid users can access this page."
      },
      upload: {
        title: "File Upload",
        description: "File upload with extensible design, multi-provider support. Login required."
      }
    },
    auth: {
      signIn: "Sign In",
      getStarted: "Get Started",
      signOut: "Sign Out"
    },
    userMenu: {
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      personalSettings: "Personal Settings",
      adminPanel: "Admin Panel"
    },
    language: {
      switchLanguage: "Switch Language",
      english: "English",
      chinese: "中文"
    },
    mobile: {
      themeSettings: "Theme Settings",
      languageSelection: "Language Selection",
      openMenu: "Open main menu"
    }
  },
  docs: {
    home: {
      title: "AI Body Editor Docs",
      subtitle: "Built with Fumadocs",
      description: "A static site project based on Fumadocs, perfect for documentation, blogs, and static pages.",
      cta: {
        docs: "Read Docs",
        blog: "Visit Blog"
      }
    },
    nav: {
      docs: "Docs",
      blog: "Blog"
    },
    blog: {
      title: "Blog",
      description: "Latest articles and updates from the AI Body Editor team",
      allPosts: "All Posts",
      previousPage: "← Previous",
      nextPage: "Next →",
      back: "← Back to Blog",
      noPosts: "No posts yet"
    }
  },
  upload: {
    title: "Upload Files",
    description: "Upload images to cloud storage",
    providerTitle: "Storage Provider",
    providerDescription: "Select your preferred cloud storage provider",
    providers: {
      oss: "Alibaba Cloud OSS",
      ossDescription: "China-optimized storage",
      s3: "Amazon S3",
      s3Description: "Global cloud storage",
      r2: "Cloudflare R2",
      r2Description: "Zero egress fees",
      cos: "Tencent Cloud COS",
      cosDescription: "China cloud storage"
    },
    uploadTitle: "Upload Image",
    uploadDescription: "Drag and drop image or click to browse. Max 1MB.",
    dragDrop: "Drag & drop file here",
    orClick: "Or click to browse (max 1MB)",
    browseFiles: "Browse files",
    clearAll: "Clear all",
    uploadedTitle: "Uploaded Files",
    uploadedDescription: "{count} file(s) uploaded successfully",
    uploading: "Uploading...",
    viewFile: "View",
    uploaded: "Uploaded",
    errors: {
      maxFiles: "You can only upload 1 file",
      imageOnly: "Only image files are allowed",
      fileTooLarge: "File size must be less than 1MB"
    }
  },
  blog: {
    metadata: {
      title: "AI Body Editor - Blog",
      description: "Read the latest articles and updates from the AI Body Editor team.",
      keywords: "blog, articles, updates, AI Body Editor, SaaS"
    },
    title: "Blog",
    subtitle: "Latest articles and updates",
    readMore: "Read More",
    publishedOn: "Published on",
    by: "by",
    noPosts: "No posts yet. Check back soon!",
    backToBlog: "Back to Blog"
  }
} as const; 
