import type { Locale } from './types'

export const en: Locale = {
  imageDetails: { label: "Image specifications", format: "{width} × {height} px · {format} · {size}", downloadOriginal: "Download the original generated file" },
  legal: {
    acceptTerms: "By continuing, you agree to the", acknowledgePrivacy: "and acknowledge the",
    navigation: "Policies", updated: "Last updated: {date}", contactTitle: "Contact and privacy requests",
    contact: "For questions about these policies or requests to access, correct or delete personal data, contact {operator} at:",
    requestDetails: "Include your account email and the relevant edit date or job ID, if available. Do not email passwords or send the original photo unless requested. We may ask for information to verify that the request concerns your data.",
    privacy: {
      title: "Privacy Policy", metadata: { title: "Privacy Policy | AI Body Editor", description: "How AI Body Editor processes uploads, uses service providers, stores generated images and handles privacy requests." },
      intro: "This notice describes how {operator}, the operator of aibodyeditor.net, handles information when you use this website and its photo editor.",
      sections: [
        { title: "Photos and editing instructions", paragraphs: ["Choosing a photo creates a preview in your browser. When you select Edit Photo, the original image, selected mode, intensity and any instructions you entered are sent through our server to the image-processing service. We do not archive the original upload in our image store or in My works.", "We store the generated result and task information such as the account or guest identifier, mode, intensity, timestamps, status and a request fingerprint. The fingerprint helps identify duplicate requests; it is not an archived copy of your photo."] },
        { title: "Account, technical and usage information", paragraphs: ["If you create an account, we process account details such as your email, display name, authentication records and credit transactions to provide sign-in, protect the account and track usage. If you use a supported external sign-in provider, we receive the information that provider supplies for authentication.", "Hosting and security services may process IP addresses, browser information, request times and diagnostic logs. To limit abuse of the guest trial, the application stores a keyed hash derived from the network address and a guest identifier."] },
        { title: "Service providers and international processing", paragraphs: ["We use Cloudflare for hosting and private image storage, Neon/PostgreSQL for account and task records, and email delivery providers for account messages. Photo editing is currently routed through the Rabbit API gateway at api.tu-zi.com and its upstream image-processing providers. These providers receive the data needed to carry out their role.", "Our retention rules describe storage controlled by this website. They do not guarantee the gateway or its upstream providers’ retention or model-training practices. We do not promise zero retention or no training by those providers. Providers may process information in countries other than your own."] },
        { title: "How long information is kept", paragraphs: ["Generated images are available for {days} days from task creation, unless you delete them sooner. Access ends at expiry; stored files are removed by periodic cleanup. Download images you want to keep. Guest results are not automatically added to an account’s My works library.", "Deleting an image does not delete the account, credit ledger or task metadata. Those records may remain to operate the account, prevent duplicate charges, investigate misuse and meet applicable recordkeeping obligations. This notice does not promise that every data category is deleted after {days} days."] },
        { title: "Cookies and browser storage", paragraphs: ["We use authentication cookies for sign-in and an HttpOnly guest-trial cookie to recognize the browser and authorize access to its guest result. The guest cookie can last up to {guestDays} days. Browser storage also remembers the display theme and, within a tab’s session, information needed to recover an interrupted editing request.", "Clearing cookies may sign you out or remove access to a guest result. It does not delete the generated image from server storage. Where an anti-bot check is enabled, its provider also processes the information needed to perform that check."] },
        { title: "Your choices and requests", paragraphs: ["You can decline to submit a photo, remove extra instructions, and delete a saved result from My works. Depending on the law that applies to you, you may also have rights to access, correct, delete or obtain a copy of personal data, or object to or restrict certain processing. These rights can have limits, including necessary recordkeeping and protection of other people’s data.", "The site does not currently provide a self-service account-deletion screen. An image deletion request and a request concerning account data are separate. This service is intended for adults and clothed-adult portraits; do not upload children’s photos or information you are not authorized to share."] },
      ],
    },
    terms: {
      title: "Terms of Service", metadata: { title: "Terms of Service | AI Body Editor", description: "Rules for using AI Body Editor, photo permissions, AI-generated results, credits and image storage." },
      intro: "These terms govern use of aibodyeditor.net and its photo-editing service operated by {operator}. Use the service only if you accept these terms and can enter into an agreement under the law that applies to you.",
      sections: [
        { title: "Who may use the service", paragraphs: ["You must be at least 18 years old. Keep your account credentials secure and use accurate account details. Do not use another person’s account without authorization or attempt to bypass access controls or guest-trial limits."] },
        { title: "Photos you may submit", paragraphs: ["Submit only clothed-adult photos you own or have permission to edit and share with our processing providers. Obtain the depicted person’s permission where required. Do not submit children’s images, non-consensual intimate content, unlawful material, or content that infringes privacy or intellectual-property rights.", "Do not use the service for harassment, deceptive impersonation or other unlawful conduct. We may refuse a request or restrict access where needed to address abuse, security risks or prohibited use."] },
        { title: "AI results and your content", paragraphs: ["You retain any rights you hold in the material you submit. You authorize us and the service providers involved to process it to perform the edit you requested and deliver the result.", "AI edits are not guaranteed to match a requested body shape or preserve every facial, clothing or background detail. Review the entire image before using or sharing it. An edit is a visual alteration, not a medical assessment or a prediction of a real-world physical change. Your use of a result must respect other people’s rights; we do not guarantee that every output is unique or eligible for copyright protection."] },
        { title: "Trials, credits and failed requests", paragraphs: ["The editor shows the applicable credit cost before submission. A guest trial is subject to browser and network limits. Reviewing examples, opening saved works and downloading an existing result do not create a new paid generation request.", "A completed edit consumes the displayed credits. Deleting its image does not refund those credits. Failed or expired generation tasks use the service’s failure/refund handling; if a connection drops, check the task status before starting a new request. Available offers and any purchase terms are shown separately when purchase functionality is available."] },
        { title: "Storage and deletion", paragraphs: ["Generated images are available for {days} days unless deleted sooner. Download any result you want to retain. Clearing the editor does not delete server storage; use My works to delete a saved image. The Privacy Policy and Image deletion page explain the scope and limits of deletion."] },
        { title: "Availability, changes and applicable rights", paragraphs: ["The service may experience downtime, processing errors or changes in supported features. We do not guarantee uninterrupted availability or a particular editing result. Nothing in these terms excludes rights or remedies that applicable law does not allow us to exclude.", "We may update these terms as the service changes. The date on this page identifies the latest version. Changes are not intended to remove rights you already have under applicable law."] },
      ],
    },
    deletion: {
      title: "Image deletion and retention", metadata: { title: "Image Deletion and Retention | AI Body Editor", description: "How to delete a saved result, what Clear photo does, and how long AI Body Editor keeps generated images." },
      intro: "You control whether to keep an edited image in your saved works. This page explains the difference between clearing the editor and deleting a stored result.",
      sections: [
        { title: "Delete a saved result", paragraphs: ["Sign in, open My works from the header or mobile menu, find the image, choose Delete and confirm. A successful deletion removes the generated image from our private result storage and removes its reference from your works. Its existing preview and download URLs can no longer retrieve the file.", "Deletion is permanent and does not refund the credits used to generate the image. If deletion reports an error, try again; do not assume the image was deleted until the action succeeds."] },
        { title: "What Clear photo does", paragraphs: ["Clear photo removes the selected photo, preview, current result and related editing state from the editor. It does not delete a saved image from the server, delete your account or erase credit transactions. Use My works to delete a saved result."] },
        { title: "Automatic expiry", paragraphs: ["Generated results expire {days} days after task creation. The service stops serving an expired image, and periodic cleanup removes expired files from storage. Account and guest results follow this image expiry period. This period is not extended by opening or downloading an image.", "My works also checks for and removes expired account results when it loads. Download images you want to keep before their expiry date."] },
        { title: "Guest results", paragraphs: ["Guest results are not listed in a registered account’s My works. Access depends on the original browser’s guest cookie; clearing it can remove your ability to reopen the result without deleting the server copy. The normal expiry process still applies. For a request before expiry, use the privacy contact and include the edit date or job ID if available."] },
        { title: "What image deletion does not remove", paragraphs: ["Deleting a result does not erase your account, transaction history, request fingerprints or task records needed for operation, security or reconciliation. It also does not remove images you downloaded or shared, copies already loaded in a browser, or records independently held by an AI processing provider. We do not promise deletion from systems we do not control.", "Original uploads are not archived in our result store. A broader request about account or personal data is handled separately through the privacy contact; no self-service account-deletion screen is currently provided."] },
      ],
    },
  },
  myWorks: {
    metadata: { title: "My Works | AI Body Editor", description: "View, download and delete your saved body edits." },
    title: "My works", description: "Your saved edits, all in one place.",
    retention: "Results are saved for {days} days, then automatically deleted. Download the images you want to keep.",
    empty: "No saved edits yet", emptyHint: "Your successful edits will appear here when you generate while signed in.",
    editPhoto: "Edit a photo", loading: "Loading your works…", loadError: "Your works couldn’t load. Please try again.",
    imageError: "Image unavailable", retry: "Try again", preview: "View image", imageAlt: "Your {mode} edit",
    intensity: "Intensity {value}/100", expires: "Expires {date}", download: "Download", delete: "Delete",
    deleteTitle: "Delete this image?", deleteDescription: "This permanently removes the saved image. Credits used for this edit are not refunded.",
    cancel: "Cancel", deleting: "Deleting…", deleteError: "The image couldn’t be deleted. Please try again.",
    downloadError: "The image couldn’t be downloaded. Please try again.", previous: "Previous", next: "Next", page: "Page {page}",
  },
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
        ai_body_edit: "AI Body Edit",
        body_edit_trial: "Body Editor Trial Credits",
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
      title: "AI Body Editor | Reshape & Slim Your Body in Photos",
      description: "Edit clothed portraits with Slim, Muscle, Proportions or Breast. Choose an intensity, generate an AI photo edit, compare the result and download it."
    },
    nav: {
      tryFree: "Edit a photo",
      tools: "Tools",
      toolsDescription: "Photo editing guides"
    },
    hero: {
      badge: "AI photo editing",
      title: "AI Body Editor",
      subtitle: "Choose a photo, an editing mode and an intensity. Generate your edit, compare it with the original and download the result.",
      note: "Clothed adult photos only · One free guest edit · Private results"
    },
    examples: {
      title: "Try an example",
      selectorLabel: "Choose an editing example",
      chooseLabel: "Try {name}",
      settingsOnly: "Only apply settings",
      settingsOnlyPhotoRequired: "Upload a photo to use “Only apply settings”.",
      previousExamples: "Previous examples",
      nextExamples: "More examples",
      sampleResult: "Saved example result",
      loadingSample: "Loading sample photo…",
      original: "Original",
      result: "Result",
      photoViews: "Photo views",
      settingsTitle: "Edit settings",
      emptyHint: "Upload your own photo, or choose an example above to try its photo and settings.",
      resultPlaceholder: "Your edited photo will appear here",
      generationIncomplete: "No new result yet",
      resultPlaceholderHint: "Choose your settings, then select Edit Photo to generate a result.",
      currentSettingsDiffer: "Settings changed. Generate again to update this result.",
      sampleSettingsChanged: "Settings changed. Select Edit Photo to generate a new result.",
      sampleNote: "Actual editor output from an AI-created adult sample. Select Edit Photo to generate with your current settings.",
      reviewResult: "Review the face, clothing and background before downloading.",
      labels: {
        naturalSlim: "Natural slim",
        muscle: "Athletic build",
        proportions: "Body balance",
        breast: "Breast · Fuller",
        breastSubtle: "Breast · Subtle",
        legProportions: "Longer legs",
        shoulders: "Shoulders only",
        waistOnly: "Waist only",
        fullerFigure: "Slightly fuller",
        customCombination: "Shoulders + waist"
      }
    },
    realResults: {
      "title": "Actual results from this editor",
      "description": "Explore four editing modes and specific body-edit requests. These are actual editor outputs from AI-created adult sample portraits. Results vary by photo.",
      "coverage": "{cases} examples · {people} sample people · {modes} editing modes",
      "before": "Original",
      "after": "Actual result",
      "compareLabel": "Compare the original sample and actual editor result",
      "try": "Try",
      "tryLabel": "Try {name} in the editor",
      "intensity": "Intensity {value}/100",
      "requestLabel": "Instructions:",
      "showMore": "Show 4 more examples",
      "showLess": "Show fewer examples",
      "naturalSlim": {
        "title": "A naturally slimmer silhouette",
        "description": "An overall slimming edit in an everyday outfit, across the waist, arms and thighs.",
        "beforeAlt": "Original AI-created adult woman in a plum T-shirt and charcoal joggers standing in an urban courtyard",
        "afterAlt": "Actual Slim mode result for the same woman in a plum T-shirt and charcoal joggers in the courtyard",
        "instructions": ""
      },
      "muscle": {
        "title": "A stronger athletic build",
        "description": "A preset Muscle edit in a T-shirt and training shorts, across the shoulders, upper arms and chest.",
        "beforeAlt": "Original AI-created adult man in an olive athletic T-shirt and grey training shorts standing on a running track",
        "afterAlt": "Actual Muscle mode result for the same man in an olive T-shirt and training shorts, with a stronger athletic build",
        "instructions": ""
      },
      "proportions": {
        "title": "A longer-legged silhouette",
        "description": "A preset Proportions edit exploring the leg-to-torso balance and waistline.",
        "beforeAlt": "Original AI-created adult Black man in an ivory polo shirt and navy shorts standing in a modern plaza",
        "afterAlt": "Actual Proportions mode result for the same Black man in an ivory polo and navy shorts with an adjusted leg-to-torso balance",
        "instructions": ""
      },
      "breast": {
        "title": "A fuller clothed bust",
        "description": "Breast mode at a higher intensity, shown under the original crew-neck T-shirt.",
        "beforeAlt": "Original AI-created adult woman in a cream T-shirt and brown trousers standing on a sunlit terrace",
        "afterAlt": "Actual Breast mode result with a fuller bust silhouette under the same cream T-shirt on the terrace",
        "instructions": ""
      },
      "shoulders": {
        "title": "Broader shoulders only",
        "description": "A focused request for shoulder width, rather than an all-over Muscle edit.",
        "beforeAlt": "Original AI-created adult man in a teal T-shirt and navy chinos standing in a light-grey studio",
        "afterAlt": "Actual Muscle mode result for the same man in a teal T-shirt after a shoulder-only editing request",
        "instructions": "Make only my shoulders visibly broader and more athletic. Keep my waist, chest, arms and legs their original size. Keep the same clothes, face, pose and background."
      },
      "legProportions": {
        "title": "Leg proportions, with a specific request",
        "description": "A skirt outfit makes the leg line visible while extra instructions specify which body widths to preserve.",
        "beforeAlt": "Original AI-created adult woman in an ivory top and burgundy above-knee skirt standing in a pale-grey studio",
        "afterAlt": "Actual Proportions mode result for the same woman in an ivory top and burgundy skirt after a leg-proportion request",
        "instructions": "Make my legs look slightly longer relative to my torso, with natural balanced adult proportions. Keep my waist, hips, chest and arms their original width. Keep the same clothes, face, pose and background."
      },
      "breastSubtle": {
        "title": "A gentler bust adjustment",
        "description": "A different person in a crew-neck dress, using a lower Breast intensity of 40.",
        "beforeAlt": "Original AI-created adult East Asian woman with black hair in a deep green knee-length dress on a sunlit veranda",
        "afterAlt": "Actual Breast mode result at intensity 40 for the same East Asian woman in a deep green knee-length dress",
        "instructions": ""
      },
      "waistOnly": {
        "title": "A slimmer waist only",
        "description": "A custom Slim request that asks to leave the rest of the body unchanged.",
        "beforeAlt": "Original AI-created adult man in a green tank top and dark trousers standing in a bright gym",
        "afterAlt": "Actual Slim mode result with waist-only instructions applied to the same man in the green tank top",
        "instructions": "Make only my waist visibly slimmer. Keep my arms, legs, shoulders and chest their original size. Keep everything else unchanged."
      },
      "fullerFigure": {
        "title": "A slightly fuller figure",
        "description": "Extra instructions can change the direction of a preset, including a request for more fullness.",
        "beforeAlt": "Original AI-created adult blonde woman in a black sleeveless top and rust-orange knee-length skirt in a stone courtyard",
        "afterAlt": "Actual Proportions mode result for the same blonde woman in a black top and rust-orange skirt after a slightly fuller figure request",
        "instructions": "Make my overall figure slightly fuller with a gentle natural weight gain: a little more fullness in my waist, upper arms, hips and thighs. Do not slim any area. Keep healthy realistic adult proportions and the same clothes, face, pose and background."
      },
      "customCombination": {
        "title": "Two changes in one request",
        "description": "A combined request for broader shoulders and a slightly slimmer waist.",
        "beforeAlt": "Original AI-created adult white man with auburn hair and a ginger beard in a charcoal T-shirt and pale training shorts on a terrace",
        "afterAlt": "Actual Muscle mode result for the same white man in a charcoal T-shirt and pale shorts after combined shoulder and waist instructions",
        "instructions": "Broaden my shoulders and make my waist slightly slimmer for a more defined V-shaped torso. Keep my arms, chest and legs their original size. Keep the same clothes, face, pose and background."
      }
    },
    showcase: {
      eyebrow: "Slim, Muscle & Proportions",
      heroCta: "Edit a photo",
      examplesCta: "See examples",
      conceptLabel: "AI-generated concept",
      conceptNotice: "Concept images illustrate editing directions. They are not results from this app.",
      compareLabel: "Compare original and edited concepts",
      compareHint: "Drag to compare",
      before: "Original concept",
      after: "Edited concept",
      modesLabel: "Explore editing concepts",
      sampleLabel: "Try a sample photo",
      sampleNotice: "Samples are AI-generated concepts. Select Edit Photo to generate a new edit.",
      clearSample: "Clear sample",
      examplesTitle: "More editing concepts",
      examplesSubtitle: "More portraits to help you picture each editing direction.",
      previewTitle: "Edit your photo",
      previewSubtitle: "Choose a photo, mode and intensity. Generate your first edit free without signing in, then compare and download the result.",
      detailTitle: "Check your result before downloading",
      detailSubtitle: "Compare the face, clothing and background with the original.",
      detailFace: "Face and expression",
      detailClothes: "Clothing and seams",
      detailBackground: "Background lines",
      detailFaceHint: "Check that facial features and expression still look right.",
      detailClothesHint: "Review seams, fabric details and clothing coverage.",
      detailBackgroundHint: "Look for bends in walls, doorframes and other straight lines.",
      detailNotice: "AI edits can also change details you did not ask to edit. Review the whole image before saving.",
      closingTitle: "Start with a photo you like",
      closingDescription: "Choose a photo and an editing direction. Generate your first edit free, compare and download your result.",
      pricingNote: "Try one guest edit free without signing in. Further edits require an account with credits.",
      modes: {
        slim: {
          label: "Slim",
          title: "A slimmer silhouette",
          description: "Explore a visibly slimmer waist, abdomen and upper arms in a clothed portrait.",
          cta: "Preview Slim",
          beforeAlt: "Original Slim concept: adult woman in a cream T-shirt and dark brown trousers on a warm white terrace with green plants",
          afterAlt: "Edited Slim concept: the woman in a cream T-shirt and dark brown trousers on the terrace with a noticeably narrower waist, abdomen and upper arms",
          secondaryBeforeAlt: "Original Slim concept: adult woman in a mauve long-sleeve top and indigo jeans on a leafy neighborhood street",
          secondaryAfterAlt: "Edited Slim concept: the woman in a mauve top and jeans on the street with a noticeably slimmer waist, abdomen, upper arms and thighs"
        },
        muscle: {
          label: "Muscle",
          title: "A more defined athletic look",
          description: "Explore fuller shoulders, chest and upper arms for a more defined athletic silhouette.",
          cta: "Preview Muscle",
          beforeAlt: "Original Muscle concept: adult man in a forest-green athletic tank top and charcoal trousers in a gym lit by tall windows",
          afterAlt: "Edited Muscle concept: the man in a green athletic tank top and charcoal trousers in the gym with noticeably fuller shoulders, chest and upper arms",
          secondaryBeforeAlt: "Original Muscle concept: adult man in a blue T-shirt and olive joggers on a riverside park path with trees and a stone railing",
          secondaryAfterAlt: "Edited Muscle concept: the man in a blue T-shirt and olive joggers on the riverside path with visibly broader shoulders, a fuller chest and thicker upper arms"
        },
        proportions: {
          label: "Proportions",
          title: "A clearer waist-to-hip balance",
          description: "Explore a more defined waist and balanced hip line with a clear contrast in the overall silhouette.",
          cta: "Preview Proportions",
          beforeAlt: "Original Proportions concept: adult woman in a navy jumpsuit in a studio with a terracotta wall and warm gray floor",
          afterAlt: "Edited Proportions concept: the woman in a navy jumpsuit in the studio with a noticeably more defined waist and balanced hip line",
          secondaryBeforeAlt: "Original Proportions concept: adult woman in a sage-green knit top and rust trousers in a brick courtyard with shrubs and a bicycle",
          secondaryAfterAlt: "Edited Proportions concept: the woman in a sage top and rust trousers in the courtyard with a visibly narrower waist and fuller hip line"
        }
      },
      preparation: {
        title: "Choose a clear starting photo",
        description: "Use a clothed adult portrait with even lighting and space around the person.",
        linkBefore: "For photo selection tips, read the ",
        linkText: "Body Editor",
        linkAfter: " guide."
      },
      privacy: {
        title: "Photo processing and private results",
        description: "Selecting a photo creates a local preview. When you submit an edit, your photo is sent to Rabbit API for processing. Results are stored privately and accessed using your guest browser or signed-in account."
      }
    },
    upload: {
      inputLabel: "Upload a photo to edit",
      dropTitle: "Drop a photo here or click to upload",
      dropHint: "JPG, PNG or WebP · up to 10 MB",
      modeLabel: "Choose an edit",
      modes: {
        slim: "Slim",
        muscle: "Muscle",
        proportions: "Proportions",
        breast: "Breast"
      },
      submit: "Edit Photo",
      replace: "Choose another photo",
      clear: "Clear photo",
      previewAlt: "Preview of the photo you selected",
      errors: {
        type: "Please upload a JPG, PNG or WebP image.",
        size: "This photo is larger than 10 MB."
      },
      availability: "Choose a mode and intensity. Your first guest edit is free without signing in.",
      comingSoon: "Choose a mode and intensity, then generate your free guest edit."
    },
    editing: {
      intensityLabel: "Intensity",
      intensityLow: "Subtle",
      intensityHigh: "Dramatic",
      intensityValue: "{value} out of 100",
      intensityHint: "Applies when you generate.",
      instructionsToggle: "Extra instructions (optional)",
      instructionsLabel: "Extra body-edit instructions",
      instructionsPlaceholder: "e.g., Only slim my waist; keep my arms and legs unchanged.",
      instructionsExample: "Example: Make my shoulders slightly wider.",
      instructionsHint: "Instructions apply when you generate. The outline only reflects the mode and intensity.",
      instructionsCounter: "{count}/{max} characters",
      contourPreview: {
        analyzing: "Finding your body outline…",
        unavailable: "Outline preview is unavailable. You can still generate your edit.",
        noPerson: "No clear body outline found. Try a clearer photo, or continue to generate.",
        chestUnclear: "Approximate chest area; covered edges cannot be predicted. Use Align to reposition the guide.",
        area: "Chest area",
        original: "Original",
        target: "Target outline",
        note: "Target outline · AI results may vary.",
        show: "Show outline",
        hide: "Hide outline",
        adjust: "Adjust outline alignment",
        adjustShort: "Align",
        done: "Done adjusting",
        doneShort: "Done",
        reset: "Reset alignment",
        alignmentHint: "Drag the highlighted area or use arrow keys to align the guide. This adjusts the preview only.",
        alignmentHandle: "Outline alignment: drag or use arrow keys",
      },
      intensityDescriptions: {
        slim: "Slim the waist, abdomen, arms and thighs.",
        muscle: "Increase shoulder, arm and chest muscle definition and volume.",
        proportions: "Adjust leg-to-torso proportions and define the waist.",
        breast: "Increase the bust silhouette under the original clothing."
      },
      pending: "Editing your photo…",
      resultTitle: "Your edited photo",
      loadingResult: "Loading your edited photo…",
      resultLoadError: "Your edit is saved, but the preview could not load. Reload the image to try again.",
      reloadResult: "Reload image",
      before: "Original",
      after: "Edited",
      beforeAlt: "Original photo selected for this edit",
      afterAlt: "AI-edited result of your selected photo",
      compareLabel: "Compare your original and edited photo",
      compareHint: "Drag to compare",
      download: "Download photo",
      editAnother: "Edit another photo",
      signinTitle: "Sign in to continue",
      signinDescription: "Sign in to continue with account credits. Your selected photo will stay here.",
      signinRequired: "Sign in to continue",
      trialNote: "One free guest edit per browser.",
      costNote: "{credits} credits per edit.",
      guestUsedNote: "Your free guest edit has been used. Sign in to continue with account credits.",
      guestRetryNote: "Your free edit is still available. You can try again within the retry limits.",
      refunded: "The credits for this edit were returned.",
      checkEdit: "Check edit status",
      retry: "Try again",
      errors: {
        TRIAL_EXHAUSTED: "Your free guest edit has been used. Sign in to continue.",
        TRIAL_IN_PROGRESS: "Another free edit is already running in this browser. Wait for it to finish.",
        RATE_LIMITED: "Too many trial requests. Please try again later.",
        NOT_CONFIGURED: "Editing is unavailable right now. Please try later.",
        SESSION_UNAVAILABLE: "We couldn't connect to the account database. Please try again in a moment.",
        INVALID_INPUT: "Choose a valid JPG, PNG or WebP photo up to 10 MB, a mode and an intensity.",
        INVALID_INSTRUCTIONS: "Use up to 500 characters of plain text for your extra instructions. Remove unsupported control characters and try again.",
        UNAUTHENTICATED: "Sign in to edit your photo.",
        UNAUTHORIZED: "Sign in to edit your photo.",
        FORBIDDEN: "You cannot access this edit.",
        INVALID_ORIGIN: "Open the editor on this site to submit your photo.",
        INSUFFICIENT_CREDITS: "You need more credits for this edit.",
        CONFLICT: "This request belongs to a different photo or setting. Start a new edit.",
        IDEMPOTENCY_CONFLICT: "This request belongs to a different photo or setting. Start a new edit.",
        UPSTREAM_ERROR: "The image service could not finish this edit.",
        TIMEOUT: "The edit took too long. Check its status before trying again.",
        CANCELLED: "This edit was cancelled.",
        INVALID_RESPONSE: "The image service returned an unusable result.",
        OUTPUT_TOO_LARGE: "The generated image exceeded the size limit.",
        ASYNC_RESPONSE: "The image service returned an unfinished task. Please check the edit status.",
        RESULT_UNAVAILABLE: "The edited photo could not be saved or loaded.",
        STORAGE_ERROR: "The edited photo could not be saved or loaded.",
        NOT_FOUND: "This edit could not be found.",
        UNKNOWN: "The edit could not be completed. Please try again.",
        INTERNAL_ERROR: "The edit could not be completed. Please try again.",
        NETWORK: "Connection lost. Check the edit status before trying again."
      }
    },
    modeGuide: {
      cta: "Use {mode}",
      descriptions: {
        slim: "Slim the waist, abdomen, upper arms and thighs.",
        muscle: "Add definition to the shoulders, arms and chest.",
        proportions: "Adjust leg-to-body proportions and the waistline.",
        breast: "Create a fuller bust silhouette under the original clothing."
      }
    },
    features: {
      title: "Choose what to edit",
      subtitle: "Pick a mode, then adjust intensity or add a specific instruction.",
      items: [
        {
          key: "slim",
          title: "A slimmer silhouette",
          description: "Plan a subtle change to the overall outline. Clear body edges and some space around the person make a photo easier to assess.",
          linkBefore: "For photo tips on a slimmer look, read the ",
          linkText: "skinny filter",
          linkAfter: " guide."
        },
        {
          key: "muscle",
          title: "More muscle definition",
          description: "Choose Muscle for an athletic look under the original clothing. Review the pose, shoulders and arms when comparing the result.",
          linkBefore: "For portrait choice and reshaping advice, read the ",
          linkText: "body editor",
          linkAfter: " guide."
        },
        {
          key: "proportions",
          title: "Balanced proportions",
          description: "Look at the full silhouette before deciding what to change. Camera position and clothing can affect how the shoulders, torso and legs appear.",
          linkBefore: "For advice about bust proportions in clothed portraits, read the ",
          linkText: "AI breast expansion",
          linkAfter: " guide."
        },
        {
          key: "batch",
          title: "Photo preparation",
          description: "Choose a clear portrait with visible body edges, even lighting and room around the person. A good starting photo makes your goal easier to judge.",
          linkBefore: "Find photo selection tips in the ",
          linkText: "body editor",
          linkAfter: " guide."
        }
      ]
    },
    howItWorks: {
      title: "Start with a photo",
      steps: [
        {
          title: "Choose your photo",
          description: "Select a clear JPG, PNG or WebP photo of a clothed adult, up to 10 MB."
        },
        {
          title: "Pick a mode",
          description: "Choose Slim, Muscle, Proportions or Breast, then adjust the intensity slider from 1 to 100."
        },
        {
          title: "Generate and compare",
          description: "Select Edit Photo. Compare the result with your original, check the details and download the image."
        }
      ]
    },
    action: {
      title: "Editing concepts",
      subtitle: "AI concept illustrations for the editing directions.",
      before: "Before",
      after: "After",
      items: [
        {
          key: "slim",
          beforeAlt: "Placeholder illustration for Slim showing a simple body silhouette",
          afterAlt: "Alternate placeholder illustration for Slim showing the same body silhouette",
          caption: "Slim goal: a narrower body outline"
        },
        {
          key: "muscle",
          beforeAlt: "Placeholder illustration for Muscle showing a simple body silhouette",
          afterAlt: "Alternate placeholder illustration for Muscle showing the same body silhouette",
          caption: "Muscle goal: more upper body definition"
        },
        {
          key: "proportions",
          beforeAlt: "Placeholder illustration for Proportions showing a simple body silhouette",
          afterAlt: "Alternate placeholder illustration for Proportions showing the same body silhouette",
          caption: "Proportions goal: balance the overall silhouette"
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
          title: "One editor, four modes",
          description: "The homepage and guides use the same AI Body Editor with Slim, Muscle, Proportions and Breast choices."
        },
        {
          title: "Practical photo advice",
          description: "Find help with portrait selection, body reshaping goals and details to check when reviewing an edit."
        },
        {
          title: "Preview before sending",
          description: "Selecting a photo stays local. Submitting an edit sends it for AI processing; guest results are accessible from this browser, and account results require sign-in."
        }
      ]
    },
    pricing: {
      title: "Pricing",
      subtitle: "Try one guest edit free. Sign in and use credits for further edits.",
      free: {
        name: "Guest trial",
        detail: "One free edit per browser · No sign-in required"
      },
      packs: {
        starter: "Starter",
        pro: "Pro"
      },
      credits: "{credits} credits",
      neverExpire: "Credits never expire",
      comingSoon: "Price coming soon",
      ctaFree: "Edit a photo",
      ctaPack: "Get started"
    },
    faq: {
      title: "FAQ",
      items: [
        {
          question: "How do I edit a photo?",
          answer: "Choose a JPG, PNG or WebP photo up to 10 MB, select Slim, Muscle, Proportions or Breast and choose an intensity. Generate your first guest edit free, then compare and download the result."
        },
        {
          question: "Which mode is for a slimmer look?",
          answer: "Choose Slim for a narrower waist and upper-arm silhouette. The intensity slider controls the intended strength; the result depends on the starting photo."
        },
        {
          question: "What is Muscle mode for?",
          answer: "Muscle adds athletic shoulder and arm definition under the original clothing. Choose an intensity and inspect the generated result for believable anatomy and garment details."
        },
        {
          question: "How do I choose a photo for a natural looking edit?",
          answer: "Use a sharp portrait with even lighting and space around the person. Visible clothing seams and background lines give you useful reference points when judging a change."
        },
        {
          question: "How much does an edit cost?",
          answer: "Guests can generate one successful edit per browser for free, with retry and network limits. Further edits require an account with credits and cost 15 credits each. Signing in grants no additional trial. Failed guest edits restore the opportunity; failed paid edits return their credits."
        },
        {
          question: "Can I edit several photos at once?",
          answer: "Edit one photo at a time. Choose another photo for the next edit. Video and batch editing are not supported."
        },
        {
          question: "When is my photo uploaded?",
          answer: "Choosing a photo creates a local preview. Submitting Edit Photo uploads it for processing by Rabbit API. The app stores the result privately for your guest browser or signed-in account and does not persistently store your original upload."
        },
        {
          question: "Can I edit on my phone?",
          answer: "Yes. Choose a photo in your mobile browser, generate your first guest edit free. You can compare and download the result without installing an app."
        }
      ]
    },
    tools: {
      title: "Photo editing guides",
      items: [
        {
          key: "bodyEditor",
          title: "Body Editor",
          description: "Choose a portrait, plan a body reshape and learn what to check."
        },
        {
          key: "skinnyFilter",
          title: "Skinny Filter",
          description: "Photo choice and proportion tips for a subtler slim look."
        },
        {
          key: "breastExpansion",
          title: "AI Breast Expansion",
          description: "Use Breast mode for a fuller clothed bust silhouette, with garment and proportion checks."
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
      relatedTitle: "Related guides",
      homeLinkText: "AI body editor",
      homeLinkDescription: "Edit a photo in the same AI Body Editor and explore all four modes.",
      editorIntro: "Every guide uses the same AI Body Editor with Slim, Muscle, Proportions and Breast modes, plus a continuous intensity slider."
    },
    bodyEditor: {
      keyword: "body editor",
      metadata: {
        title: "Body Editor | Photo Reshaping Guide and Portrait Tips",
        description: "Use the body editor to reshape clothed portraits with four modes and a continuous intensity slider. Generate an AI edit, compare the original and download the result."
      },
      breadcrumb: "Body Editor",
      hero: {
        title: "Body Editor",
        subtitle: "Choose the right portrait, set a clear body reshaping goal and learn which details to check when reviewing a change.",
        note: "Clothed adult photos only · Four modes · 1–100 intensity · One free guest edit"
      },
      what: {
        title: "What is a body editor?",
        paragraphs: [
          "A body editor changes the way a person's silhouette appears in a photo. Common goals include a slimmer outline, more muscle definition or a different balance between the upper and lower body. Start with one clear aim: decide what bothers you about the picture and whether it comes from the pose, the outfit or the shape you want to explore.",
          "Photo choice often matters more than the size of a planned change. A phone held close to the body, a twisted stance or a coat covering the waist can make proportions difficult to read. Compare the image with another portrait taken from a comfortable distance. If the issue is mainly the angle, taking a new picture can give you a better starting point than trying to reshape a poor one.",
          "For an outfit portrait, you might want the silhouette to read more evenly while keeping the way the garment hangs. In a fitness portrait, the aim might be to explore a more defined appearance. Keep those goals specific to the photo. An edited image cannot show how a body will change through training, and it cannot establish how an item of clothing will fit.",
          "On this site, the Body Editor guide and homepage use one AI Body Editor. Choose Slim, Muscle, Proportions or Breast, then adjust the intensity slider from 1 to 100. Submit the original photo to generate an edit. Compare the result with your source image and download it only after reviewing the details. The advice below helps you choose a useful starting photo and assess the change."
        ],
        linkBefore: "The ",
        linkAfter: " homepage explains the product and offers the same photo editor.",
        sibling: {
          key: "skinnyFilter",
          before: "If your goal is an overall slimmer silhouette, the ",
          after: " guide has more advice about photo choice and subtle slimming."
        },
        figure: {
          beforeAlt: "Body editor concept illustration showing a wide silhouette inside a rectangular frame",
          afterAlt: "Body editor concept illustration showing a narrower silhouette inside the same frame",
          caption: "Illustrated reshape concept: assess the body outline alongside visible background details."
        }
      },
      howTo: {
        title: "How to edit a body photo",
        steps: [
          {
            title: "Choose a clear portrait",
            description: "Pick a sharp JPG, PNG or WebP photo, up to 10 MB, with a clothed adult as the subject. A full body portrait is useful for overall proportions. A half body image can help you assess the torso and shoulders."
          },
          {
            title: "Check the visible outline",
            description: "Look for room around the person and clear separation from the background. Crossed arms, a bag against the waist or a tight crop can hide the shape you want to evaluate. Try another image if important edges are missing."
          },
          {
            title: "Choose your direction",
            description: "Select Slim for a narrower waist and arms, Muscle for athletic definition, Proportions for overall balance or Breast for a fuller clothed bust silhouette. Adjust the intensity slider from 1 to 100. Start with a restrained change when clothing or background details are complex."
          },
          {
            title: "Generate, compare and download",
            description: "Select Edit Photo to send the original for AI processing. Wait for the result, then move the comparison control to inspect the face, hands, clothing and background. Download the edited image when you are satisfied. A generated result can vary from your intended change."
          }
        ]
      },
      tips: {
        title: "Body editor photo tips",
        items: [
          {
            title: "Keep the pose readable",
            description: "Choose a pose where the shoulders, waist and hips are easy to distinguish. A relaxed stance with some space between the arms and torso is easier to assess than a tightly folded pose. Keep the feet in frame when you want to judge leg proportions."
          },
          {
            title: "Use details as reference points",
            description: "Clothing seams, buttons, floor tiles and door frames can help you spot an awkward change. Review those details as well as the body. Watch for uneven patterns, bent lines or a hand that no longer sits naturally, especially when using a stronger intensity."
          },
          {
            title: "Keep your original",
            description: "Save the source photo so you can compare any later edit with it. Judge the whole image at its normal viewing size, then inspect the edges more closely. Across a photo set, aim for a consistent appearance while allowing for differences in pose and camera angle."
          }
        ]
      },
      faq: {
        title: "Body editor FAQ",
        items: [
          {
            question: "Is Body Editor a different tool from the homepage?",
            answer: "No. Both pages use the same AI Body Editor with Slim, Muscle, Proportions and Breast, plus a continuous intensity slider. This page adds photo selection advice and body reshaping guidance."
          },
          {
            question: "Can I reshape my body with it now?",
            answer: "Yes. Choose an original photo, a mode and an intensity, then select Edit Photo. The editor sends it for AI processing and shows a result you can compare and download."
          },
          {
            question: "Are there controls for individual body areas?",
            answer: "Use Slim, Muscle, Proportions or Breast and adjust the intensity slider. There are no separate waist, hip, arm or leg sliders, and intensity is an editing direction rather than an exact measurement."
          },
          {
            question: "Should I use a full body or half body portrait?",
            answer: "Choose a full body photo when you want to assess leg length or the balance of the whole silhouette. A half body portrait is useful when your attention is on the torso or shoulders. Keep the area you care about fully visible."
          },
          {
            question: "What makes a body reshape look awkward?",
            answer: "A changed outline can look out of place beside the original pose, clothing or background. Check the hands, garment seams and nearby straight lines when evaluating any edited image. Large changes can be harder to reconcile with those details."
          },
          {
            question: "Can I use a photo of someone else?",
            answer: "Use a photo of another adult only with their permission. Choose a clothed portrait and agree on the intended change before editing or sharing it."
          },
          {
            question: "Where does my selected photo go?",
            answer: "Selecting a photo creates a local preview. When you submit an edit, the app sends the original to Rabbit API for processing. The result is stored privately for your guest browser or signed-in account; the app does not persistently store the original upload."
          }
        ]
      },
      related: {
        description: "Portrait choice, reshaping goals and photo checks for the same editor."
      }
    },
    skinnyFilter: {
      keyword: "skinny filter",
      metadata: {
        title: "Skinny Filter | Slim Photo Guide and Portrait Tips",
        description: "Apply Slim in the AI body editor with a continuous intensity slider. Use these skinny filter photo tips, compare the generated edit and download your result."
      },
      breadcrumb: "Skinny Filter",
      hero: {
        title: "Skinny Filter",
        subtitle: "Plan a slimmer silhouette with photo selection tips and advice for keeping the overall portrait believable.",
        note: "Clothed adult photos only · Four modes · 1–100 intensity · One free guest edit"
      },
      what: {
        title: "What is a skinny filter?",
        paragraphs: [
          "A skinny filter is a photo effect that makes a person's outline look slimmer. People use the term for several kinds of edits, from a light change to the torso to a narrower silhouette across the whole portrait. In this guide, the focus is on choosing a suitable picture and planning a modest change that still fits the person, pose and outfit.",
          "Look at the starting image before deciding what needs to be slimmer. A seated pose folds clothing around the waist. An oversized coat can make the upper body look wider, while an arm pressed against the torso can hide the waist entirely. Another photo from the same session may show the outline more clearly and reduce the need for a change.",
          "A useful slimming reference shows the body with some space around it. In a standing portrait, leave the hands and feet visible if possible. For a seated photo, look for a pose where the torso is easy to read and the clothing is not bunched up. Keep the original crop when comparing candidates so you can judge the full composition.",
          "Slim is part of the AI Body Editor used on the homepage and every guide. It targets a narrower waist and upper-arm outline. Choose an original photo, adjust the intensity slider from 1 to 100, then generate an edit. Compare the result with the whole original portrait before downloading. The other modes remain available in the same editor when your goal concerns muscle definition, overall proportions or a clothed bust silhouette."
        ],
        linkBefore: "For the product overview and the other mode choices, visit the ",
        linkAfter: " homepage.",
        sibling: {
          key: "bodyEditor",
          before: "For broader advice about body reshaping goals and choosing a portrait, read the ",
          after: " guide."
        },
        figure: {
          beforeAlt: "Skinny filter concept illustration showing the original silhouette",
          afterAlt: "Skinny filter concept illustration showing a narrower silhouette",
          caption: "Illustrated slimming concept: compare the whole silhouette when planning a change."
        }
      },
      howTo: {
        title: "How to apply the skinny filter",
        steps: [
          {
            title: "Choose a suitable portrait",
            description: "Select a JPG, PNG or WebP photo up to 10 MB. Use a clothed adult portrait with a clear outline and enough space around the body to assess its proportions."
          },
          {
            title: "Choose Slim",
            description: "Select Slim in the shared editor, then adjust the intensity slider from 1 to 100. The choice controls the intended strength in the AI instructions. Start with a low strength if you want to assess a small waist and upper-arm change before trying a stronger result."
          },
          {
            title: "Read the pose and clothing",
            description: "Inspect the waist and arms in context. A fold in a shirt or an arm covering the torso may explain the outline you see. Compare with another image if the intended change is hard to judge."
          },
          {
            title: "Generate and keep a reference",
            description: "Select Edit Photo. Once the result is ready, compare it with the original and inspect the face, hands and overall balance alongside the waist. Check garment seams and background lines, then download the result if the change suits the portrait."
          }
        ]
      },
      tips: {
        title: "Skinny filter photo tips",
        items: [
          {
            title: "Leave room around the outline",
            description: "A tight crop can remove the elbows or legs you need to judge the silhouette. Choose a wider portrait and assess the person within the whole scene. A small gap between the arms and torso helps you read the waist."
          },
          {
            title: "Check the face in context",
            description: "A close portrait gives little information about overall body shape. If your goal is body slimming, choose a photo that includes the torso. When assessing the result, check that the face still fits the rest of the portrait and that nearby details remain coherent."
          },
          {
            title: "Keep the change modest",
            description: "Plan a change you can describe clearly, such as a slightly narrower overall outline. Avoid judging the image only by how thin one area looks. The pose, clothing and balance between the upper and lower body matter too."
          }
        ]
      },
      faq: {
        title: "Skinny filter FAQ",
        items: [
          {
            question: "Can I apply the skinny filter now?",
            answer: "Yes. Choose a photo, select Slim and an intensity, then generate a result. The same editor lets you compare the edited photo with the original and download it."
          },
          {
            question: "How do I choose a photo for a slimmer look?",
            answer: "Start with a clear portrait where the torso is visible and the clothing does not hide the outline. Leave room around the person and check whether the camera angle or pose explains the shape you want to change."
          },
          {
            question: "Is this a separate app from AI Body Editor?",
            answer: "No. This guide uses the same AI Body Editor as the homepage. Its four modes are Slim, Muscle, Proportions and Breast, with a continuous intensity slider."
          },
          {
            question: "Can I use it on a video or a batch of photos?",
            answer: "The editor accepts one JPG, PNG or WebP image at a time, up to 10 MB. It does not support video or batch editing. Choose another photo to start a separate edit."
          },
          {
            question: "Will a slimming edit always look natural?",
            answer: "That depends on the source image and the change. Clothing patterns, body balance and background lines all affect how believable an edited portrait looks. Keep the original and compare the whole image."
          },
          {
            question: "Do these tips apply to men and women?",
            answer: "Yes. Clear body edges, a readable pose and room around the person are useful for any clothed adult portrait. Choose a goal that suits the person in the photo."
          },
          {
            question: "Can I use nude photos?",
            answer: "Use clothed adult portraits only. Choose an image you have permission to use and share."
          }
        ]
      },
      related: {
        description: "Photo selection and subtle slimming advice for the shared editor's Slim mode."
      }
    },
    breastExpansion: {
      keyword: "AI breast expansion",
      metadata: {
        title: "AI Breast Expansion | Clothed Photo Proportion Guide",
        description: "Use Breast mode in the AI body editor for clothed bust silhouette edits. Choose an intensity, generate a result, compare details and download the photo."
      },
      breadcrumb: "AI Breast Expansion",
      hero: {
        title: "AI Breast Expansion",
        subtitle: "Understand bust proportions in clothed portraits, choose a useful starting photo and learn which garment details to check.",
        note: "Clothed adult photos only · Four modes · 1–100 intensity · One free guest edit"
      },
      what: {
        title: "What is AI breast expansion?",
        paragraphs: [
          "AI breast expansion is a photo edit that makes the bust silhouette appear fuller under the existing clothing. The aim is to adjust garment volume while preserving the neckline, coverage and pose. This guide explains how to choose a useful portrait and judge those details. Select Breast in the shared AI Body Editor for this direction; Proportions remains available for a broader change to the overall silhouette.",
          "Read the clothing before deciding on a change. A loose blouse may hide the body outline, while a structured jacket may hold its own shape. The neckline, seams and folds tell you how the garment sits in the original photo. Choose an image where those details are visible, so a later comparison has useful reference points.",
          "A fuller outline also changes how the upper body relates to the shoulders, waist and hips in the picture. A portrait that includes the torso gives more context than a close crop around the chest. Keep the person's posture in view, and check whether the camera angle or drape of the fabric explains the appearance you want to adjust.",
          "An edited portrait changes the image, not the body. It cannot predict a physical change or how clothing will fit in real life. Choose a clothed adult portrait you have permission to edit, select Breast and an intensity, then generate a result. Compare the whole image with the original before focusing on the bust outline, and check the neckline, fabric folds, hands and surrounding background."
        ],
        linkBefore: "For the product overview and all four mode choices, visit the ",
        linkAfter: " homepage.",
        sibling: {
          key: "bodyEditor",
          before: "For help with the whole silhouette and portrait selection, read the ",
          after: " guide. It uses the same editor."
        },
        figure: {
          beforeAlt: "AI breast expansion concept illustration showing the original upper body silhouette",
          afterAlt: "AI breast expansion concept illustration showing a fuller upper body silhouette",
          caption: "Illustrated proportion concept: judge the upper body in the context of the whole portrait."
        }
      },
      howTo: {
        title: "How to edit a clothed bust silhouette",
        steps: [
          {
            title: "Choose a clear clothed portrait",
            description: "Use a JPG, PNG or WebP image up to 10 MB, showing a clothed adult. Include the shoulders and waist so you can judge the upper body in context. Avoid a crop that removes the edges of the garment."
          },
          {
            title: "Inspect the garment",
            description: "Look for visible seams, buttons or fabric folds. Fitted clothing can make the outline easier to read, while heavy layers may hide it. Use another photo if the shape is unclear."
          },
          {
            title: "Choose Breast and an intensity",
            description: "Select Breast in the shared editor. Adjust the intensity slider from 1 to 100 to describe the intended change. The AI instructions keep the subject clothed and retain the original neckline; inspect the result because preservation is not guaranteed."
          },
          {
            title: "Generate and assess the result",
            description: "Select Edit Photo. When the result is ready, compare the shoulders, waist and hips with the original. Check the neckline and garment seams for coherent folds, and make sure the hands and background still look plausible before downloading."
          }
        ]
      },
      tips: {
        title: "Clothed proportion photo tips",
        items: [
          {
            title: "Use a readable neckline and seams",
            description: "Choose a photo where the garment's structure is visible. A neckline or row of buttons gives you something concrete to compare. Dark shadows, scarves and several layers can make the starting silhouette difficult to read."
          },
          {
            title: "Keep the whole torso in view",
            description: "Include the shoulders and waist when assessing bust proportions. A tight chest crop removes the context that helps you judge balance. Check the full portrait before concentrating on one detail."
          },
          {
            title: "Check fabric patterns",
            description: "Stripes, prints and stitching can reveal an awkward change. In the generated result, follow the pattern across the garment and look for abrupt bends, missing details or folds that do not match the pose. Try a subtler intensity if the fabric looks distorted."
          }
        ]
      },
      faq: {
        title: "AI breast expansion FAQ",
        items: [
          {
            question: "Can I generate an AI breast expansion edit now?",
            answer: "Yes. Select Breast and an intensity in the shared editor, choose a clothed adult portrait and generate an edit. Compare the result with the original and check the garment before downloading."
          },
          {
            question: "Which mode changes the bust silhouette?",
            answer: "Choose Breast for a fuller bust outline under the original clothes. Choose Proportions for overall shoulder, waist and leg balance. Neither mode offers an exact cup size or a separate body-area slider."
          },
          {
            question: "Does this guide use a different editor?",
            answer: "No. Every guide and the homepage use the same AI Body Editor. All four modes and a continuous intensity slider are available; this guide adds advice about clothed bust silhouettes."
          },
          {
            question: "Which clothes make proportions easier to assess?",
            answer: "Choose a garment with a visible outline, neckline and seams. A fitted top often gives more context than bulky layers. Keep enough of the torso in the photo to see how the outfit sits."
          },
          {
            question: "Can an edited image predict a physical change?",
            answer: "A photo edit changes an image. It cannot predict a physical change to the body or show how a garment will fit after one. Use it as a visual concept."
          },
          {
            question: "Can I use someone else's photo?",
            answer: "Use a clothed adult portrait only with the person's permission. Agree on the intended change and how the image will be used before editing or sharing it."
          },
          {
            question: "When is my selected photo uploaded?",
            answer: "Selecting a photo only previews it locally. Submitting an edit sends the original to Rabbit API for processing. Your result is stored privately for your guest browser or signed-in account; the app does not persistently store the original upload."
          }
        ]
      },
      related: {
        description: "Clothing and silhouette tips for planning a bust proportion edit."
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
