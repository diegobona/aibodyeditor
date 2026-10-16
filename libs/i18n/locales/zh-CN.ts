import type { Locale } from './types'

export const zhCN: Locale = {
  common: {
    welcome: "欢迎使用 TinyShip",
    siteName: "TinyShip",
    login: "登录",
    signup: "注册",
    logout: "退出登录",
    profile: "个人资料",
    settings: "设置",
    and: "和",
    loading: "加载中...",
    unexpectedError: "发生了意外错误",
    notAvailable: "不可用",
    viewPlans: "查看计划",
    yes: "是",
    no: "否",
    theme: {
      light: "浅色主题",
      dark: "深色主题",
      system: "系统主题",
      toggle: "切换主题",
      appearance: "外观设置",
      colorScheme: "配色方案",
      themes: {
        default: "默认主题",
        claude: "Claude主题",
        "cosmic-night": "宇宙之夜",
        "modern-minimal": "现代简约",
        "ocean-breeze": "海洋微风"
      }
    }
  },
  navigation: {
    home: "首页",
    dashboard: "仪表盘",
    orders: "订单",
    shipments: "发货",
    tracking: "追踪",
    admin: {
      dashboard: "仪表盘",
      users: "用户管理",
      subscriptions: "订阅管理",
      orders: "订单管理",
      credits: "积分管理",
      pricing: "定价管理",
      application: "应用程序",
      blog: "博客管理",
      commissions: "佣金管理",
      withdrawals: "提现管理"
    }
  },
  actions: {
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    delete: "删除",
    edit: "编辑",
    tryAgain: "重试",
    createAccount: "创建账户",
    sendCode: "发送验证码",
    verify: "验证",
    backToList: "返回用户列表",
    saveChanges: "保存更改",
    createUser: "创建用户",
    deleteUser: "删除用户",
    back: "返回",
    resendCode: "重新发送",
    resendVerificationEmail: "重新发送验证邮件",
    upload: "上传",
    previous: "上一页",
    next: "下一页",
    createPost: "新建文章",
    deletePost: "删除文章",
    backToBlog: "返回博客"
  },
  email: {
    verification: {
      subject: "验证您的 TinyShip 账号",
      title: "请验证您的邮箱地址",
      greeting: "您好 {{name}}，",
      message: "感谢您注册 TinyShip。要完成注册，请点击下方按钮验证您的电子邮箱地址。",
      button: "验证邮箱地址",
      alternativeText: "或者，您可以复制并粘贴以下链接到浏览器中：",
      expiry: "此链接将在 {{expiry_hours}} 小时后过期。",
      disclaimer: "如果您没有请求此验证，请忽略此邮件。",
      signature: "祝您使用愉快，TinyShip 团队",
      copyright: "© {{year}} TinyShip. 保留所有权利。"
    },
    resetPassword: {
      subject: "重置您的 TinyShip 密码",
      title: "重置您的密码",
      greeting: "您好 {{name}}，",
      message: "我们收到了重置您密码的请求。请点击下方按钮创建新密码。如果您没有提出此请求，可以安全地忽略此邮件。",
      button: "重置密码",
      alternativeText: "或者，您可以复制并粘贴以下链接到浏览器中：",
      expiry: "此链接将在 {{expiry_hours}} 小时后过期。",
      disclaimer: "如果您没有请求重置密码，无需进行任何操作。",
      signature: "祝您使用愉快，TinyShip 团队",
      copyright: "© {{year}} TinyShip. 保留所有权利。"
    }
  },
  auth: {
    metadata: {
      signin: {
        title: "TinyShip - 登录",
        description: "登录您的 TinyShip 账户，访问仪表板、管理订阅并使用高级功能。",
        keywords: "登录, 账户登录, 身份验证, 访问账户, 仪表板"
      },
      signup: {
        title: "TinyShip - 创建账户",
        description: "创建您的 TinyShip 账户，开始使用我们全面的脚手架构建出色的 SaaS 应用程序。",
        keywords: "注册, 创建账户, 新用户, 开始使用, 账户注册"
      },
      forgotPassword: {
        title: "TinyShip - 重置密码",
        description: "安全地重置您的 TinyShip 账户密码。输入您的邮箱以接收密码重置说明。",
        keywords: "忘记密码, 重置密码, 密码恢复, 账户恢复"
      },
      resetPassword: {
        title: "TinyShip - 创建新密码",
        description: "为您的 TinyShip 账户创建新的安全密码。选择强密码来保护您的账户。",
        keywords: "新密码, 密码重置, 安全密码, 账户安全"
      },
      phone: {
        title: "TinyShip - 手机登录",
        description: "使用手机号登录 TinyShip。通过短信验证进行快速安全的身份验证。",
        keywords: "手机登录, 短信验证, 移动端认证, 手机号码"
      },
      wechat: {
        title: "TinyShip - 微信登录",
        description: "使用微信账户登录 TinyShip。为中国用户提供便捷的身份验证。",
        keywords: "微信登录, WeChat登录, 社交登录, 中国认证"
      }
    },
    signin: {
      title: "登录您的账户",
      welcomeBack: "欢迎回来",
      socialLogin: "使用您喜欢的社交账号登录",
      continueWith: "或继续使用",
      email: "邮箱",
      emailPlaceholder: "请输入邮箱地址",
      password: "密码",
      forgotPassword: "忘记密码？",
      rememberMe: "记住我",
      submit: "登录",
      submitting: "登录中...",
      noAccount: "还没有账户？",
      signupLink: "注册",
      termsNotice: "点击继续即表示您同意我们的",
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
      socialProviders: {
        google: "Google",
        github: "GitHub",
        apple: "Apple",
        wechat: "微信",
        phone: "手机号码"
      },
      errors: {
        invalidEmail: "请输入有效的邮箱地址",
        requiredEmail: "请输入邮箱",
        requiredPassword: "请输入密码",
        invalidCredentials: "邮箱或密码错误",
        captchaRequired: "请完成验证码验证",
        emailNotVerified: {
          title: "需要邮箱验证",
          description: "请检查您的邮箱并点击验证链接。如果您没有收到邮件，可以点击下方按钮重新发送。",
          resendSuccess: "验证邮件已重新发送，请检查您的邮箱。",
          resendError: "重发验证邮件失败，请稍后重试。",
          dialogTitle: "重新发送验证邮件",
          dialogDescription: "请完成验证码验证后重新发送验证邮件",
          emailLabel: "邮箱地址",
          sendButton: "发送验证邮件",
          sendingButton: "发送中...",
          waitButton: "等待 {seconds}s"
        }
      }
    },
    signup: {
      title: "注册 TinyShip",
      createAccount: "创建账户",
      socialSignup: "使用您喜欢的社交账号注册",
      continueWith: "或继续使用",
      name: "姓名",
      namePlaceholder: "请输入您的姓名",
      email: "邮箱",
      emailPlaceholder: "请输入邮箱地址",
      password: "密码",
      passwordPlaceholder: "创建密码",
      imageUrl: "头像图片链接",
      imageUrlPlaceholder: "https://example.com/your-image.jpg",
      optional: "可选",
      submit: "创建账户",
      submitting: "创建账户中...",
      haveAccount: "已有账户？",
      signinLink: "登录",
      termsNotice: "点击继续即表示您同意我们的",
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
      verification: {
        title: "需要验证",
        sent: "我们已经发送验证邮件到",
        checkSpam: "找不到邮件？请检查垃圾邮件文件夹。",
        spamInstruction: "如果仍然没有收到，"
      },
      errors: {
        invalidName: "请输入有效的姓名",
        requiredName: "请输入姓名",
        invalidEmail: "请输入有效的邮箱地址",
        requiredEmail: "请输入邮箱",
        invalidPassword: "请输入有效的密码",
        requiredPassword: "请输入密码",
        invalidImage: "请输入有效的图片链接",
        captchaRequired: "请完成验证码验证",
        captchaError: "验证码验证失败，请重试",
        captchaExpired: "验证码已过期，请重新验证"
      }
    },
    phone: {
      title: "手机号登录",
      description: "输入您的手机号以接收验证码",
      phoneNumber: "手机号",
      phoneNumberPlaceholder: "请输入您的手机号",
      countryCode: "国家/地区",
      verificationCode: "验证码",
      enterCode: "输入验证码",
      sendingCode: "发送验证码中...",
      verifying: "验证中...",
      codeSentTo: "已发送验证码到",
      resendIn: "重新发送",
      seconds: "秒",
      resendCode: "重新发送",
      resendCountdown: "秒后可重新发送",
      termsNotice: "点击继续即表示您同意我们的",
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
      errors: {
        invalidPhone: "请输入有效的手机号",
        requiredPhone: "请输入手机号",
        requiredCountryCode: "请选择国家/地区",
        invalidCode: "请输入有效的验证码",
        requiredCode: "请输入验证码",
        captchaRequired: "请完成验证码验证"
      }
    },
    forgetPassword: {
      title: "忘记密码",
      description: "重置密码并重新获得账户访问权限",
      email: "邮箱",
      emailPlaceholder: "请输入邮箱地址",
      submit: "发送重置链接",
      submitting: "发送中...",
      termsNotice: "点击继续即表示您同意我们的",
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
      verification: {
        title: "检查您的邮箱",
        sent: "我们已经发送重置密码链接到",
        checkSpam: "找不到邮件？请检查垃圾邮件文件夹。"
      },
      errors: {
        invalidEmail: "请输入有效的邮箱地址",
        requiredEmail: "请输入邮箱",
        captchaRequired: "请完成验证码验证"
      }
    },
    resetPassword: {
      title: "重置密码",
      description: "为您的账户创建新密码",
      password: "新密码",
      passwordPlaceholder: "请输入新密码",
      confirmPassword: "确认密码",
      confirmPasswordPlaceholder: "请再次输入新密码",
      submit: "重置密码",
      submitting: "重置中...",
      success: {
        title: "密码重置成功",
        description: "您的密码已经成功重置。",
        backToSignin: "返回登录",
        goToSignIn: "返回登录"
      },
      errors: {
        invalidPassword: "密码长度至少为8个字符",
        requiredPassword: "请输入密码",
        passwordsDontMatch: "两次输入的密码不一致",
        invalidToken: "重置链接无效或已过期，请重试。"
      }
    },
    wechat: {
      title: "微信登录",
      description: "使用微信扫码登录",
      scanQRCode: "请使用微信扫描二维码",
      orUseOtherMethods: "或使用其他登录方式",
      loadingQRCode: "加载二维码中...",
      termsNotice: "点击继续即表示您同意我们的",
      termsOfService: "服务条款",
      privacyPolicy: "隐私政策",
      errors: {
        loadingFailed: "微信二维码加载失败",
        networkError: "网络错误，请重试"
      }
    },
    // Better Auth 1.4 错误代码映射
    authErrors: {
      // 用户相关错误
      USER_NOT_FOUND: "未找到该邮箱对应的账户",
      USER_ALREADY_EXISTS: "该邮箱已被注册",
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "用户已存在，请使用其他邮箱",
      USER_EMAIL_NOT_FOUND: "未找到用户邮箱",
      FAILED_TO_CREATE_USER: "创建用户失败",
      FAILED_TO_UPDATE_USER: "更新用户失败",
      
      // 认证错误
      INVALID_EMAIL: "邮箱地址无效",
      INVALID_PASSWORD: "密码无效",
      INVALID_EMAIL_OR_PASSWORD: "邮箱或密码错误",
      INVALID_CREDENTIALS: "提供的凭据无效",
      INVALID_TOKEN: "无效或已过期的令牌",
      PASSWORD_TOO_SHORT: "密码过短",
      PASSWORD_TOO_LONG: "密码过长",
      
      // 邮箱验证错误
      EMAIL_NOT_VERIFIED: "请先验证您的邮箱地址",
      EMAIL_ALREADY_VERIFIED: "邮箱已验证",
      EMAIL_MISMATCH: "邮箱不匹配",
      EMAIL_CAN_NOT_BE_UPDATED: "邮箱无法更新",
      VERIFICATION_EMAIL_NOT_ENABLED: "验证邮件功能未启用",
      
      // 会话错误
      SESSION_EXPIRED: "您的会话已过期，请重新登录",
      SESSION_NOT_FRESH: "会话不是最新的，请重新认证",
      FAILED_TO_CREATE_SESSION: "创建会话失败",
      FAILED_TO_GET_SESSION: "获取会话失败",
      
      // 账户错误
      ACCOUNT_NOT_FOUND: "账户未找到",
      ACCOUNT_BLOCKED: "您的账户已被临时冻结",
      CREDENTIAL_ACCOUNT_NOT_FOUND: "凭证账户未找到",
      SOCIAL_ACCOUNT_ALREADY_LINKED: "社交账户已关联",
      LINKED_ACCOUNT_ALREADY_EXISTS: "关联账户已存在",
      FAILED_TO_UNLINK_LAST_ACCOUNT: "无法解除最后一个账户的关联",
      USER_ALREADY_HAS_PASSWORD: "用户已设置密码",
      
      // 手机号错误
      PHONE_NUMBER_ALREADY_EXISTS: "该手机号已被注册",
      INVALID_PHONE_NUMBER: "手机号格式无效",
      OTP_EXPIRED: "验证码已过期",
      INVALID_OTP: "验证码错误",
      OTP_TOO_MANY_ATTEMPTS: "验证尝试次数过多，请重新获取验证码",
      
      // 提供商错误
      PROVIDER_NOT_FOUND: "提供商未找到",
      ID_TOKEN_NOT_SUPPORTED: "不支持 ID Token",
      FAILED_TO_GET_USER_INFO: "获取用户信息失败",
      
      // 安全错误
      CAPTCHA_REQUIRED: "请完成验证码验证",
      CAPTCHA_INVALID: "验证码验证失败",
      TOO_MANY_REQUESTS: "请求过于频繁，请稍后重试",
      CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "跨站导航登录被阻止",
      INVALID_ORIGIN: "无效的来源",
      MISSING_OR_NULL_ORIGIN: "来源缺失或无效",
      
      // 回调 URL 错误
      INVALID_CALLBACK_URL: "无效的回调 URL",
      INVALID_REDIRECT_URL: "无效的重定向 URL",
      INVALID_ERROR_CALLBACK_URL: "无效的错误回调 URL",
      INVALID_NEW_USER_CALLBACK_URL: "无效的新用户回调 URL",
      CALLBACK_URL_REQUIRED: "需要回调 URL",
      
      // 验证错误
      VALIDATION_ERROR: "验证错误",
      MISSING_FIELD: "缺少必填字段",
      FIELD_NOT_ALLOWED: "不允许的字段",
      ASYNC_VALIDATION_NOT_SUPPORTED: "不支持异步验证",
      
      // 系统错误
      FAILED_TO_CREATE_VERIFICATION: "创建验证失败",
      EMAIL_SEND_FAILED: "邮件发送失败，请稍后重试",
      SMS_SEND_FAILED: "短信发送失败，请稍后重试",
      UNKNOWN_ERROR: "发生未知错误"
    }
  },
  admin: {
    metadata: {
      title: "TinyShip - 管理后台",
      description: "全面的管理仪表板，用于管理用户、订阅、订单和系统分析，为您的SaaS应用提供强大的管理功能。",
      keywords: "管理后台, 仪表板, 管理, SaaS, 分析, 用户, 订阅, 订单"
    },
    dashboard: {
      title: "管理员仪表板",
      accessDenied: "访问被拒绝",
      noPermission: "您没有权限访问管理员仪表板",
      lastUpdated: "最后更新",
      metrics: {
        totalRevenue: "总收入",
        totalRevenueDesc: "历史总收入",
        newCustomers: "本月新客户",
        newCustomersDesc: "本月新增客户数",
        newOrders: "本月新订单",
        newOrdersDesc: "本月新增订单数",
        fromLastMonth: "较上月"
      },
      chart: {
        monthlyRevenueTrend: "月度收入趋势",
        revenue: "收入",
        orders: "订单数"
      },
      todayData: {
        title: "今日数据",
        revenue: "收入",
        newUsers: "新用户",
        orders: "订单数"
      },
      monthData: {
        title: "本月数据",
        revenue: "本月收入",
        newUsers: "本月新用户",
        orders: "本月订单数"
      },
      recentOrders: {
        title: "最近订单",
        orderId: "订单ID",
        customer: "客户",
        plan: "计划",
        amount: "金额",
        provider: "支付方式",
        status: "状态",
        time: "时间",
        total: "总计"
      }
    },
    users: {
      title: "用户管理",
      subtitle: "管理用户、角色和权限",
      createUser: "创建用户",
      editUser: "编辑用户",
      actions: {
        addUser: "添加用户",
        editUser: "编辑用户",
        deleteUser: "删除用户",
        banUser: "封禁用户",
        unbanUser: "解封用户"
      },
      table: {
        columns: {
          id: "ID",
          name: "姓名",
          email: "邮箱",
          role: "角色",
          phoneNumber: "手机号",
          emailVerified: "邮箱验证",
          banned: "封禁状态",
          referralCode: "推荐码",
          referredByCode: "邀请人",
          commissionBalance: "佣金余额",
          createdAt: "创建时间",
          updatedAt: "更新时间",
          actions: "操作"
        },
        actions: {
          editUser: "编辑用户",
          deleteUser: "删除用户",
          clickToCopy: "点击复制"
        },
        sort: {
          ascending: "升序排列",
          descending: "降序排列",
          none: "取消排序"
        },
        noResults: "未找到用户",
        search: {
          searchBy: "搜索字段",
          searchPlaceholder: "搜索 {field}...",
          filterByRole: "按角色筛选",
          allRoles: "所有角色",
          banStatus: "封禁状态",
          allUsers: "所有用户",
          bannedUsers: "已封禁",
          notBannedUsers: "未封禁",
          view: "视图",
          toggleColumns: "切换列显示"
        },
        pagination: {
          showing: "显示第 {start} 到 {end} 条，共 {total} 条结果",
          pageInfo: "第 {current} 页，共 {total} 页"
        },
        dialog: {
          banTitle: "封禁用户",
          banDescription: "您确定要封禁此用户吗？他们将无法访问应用程序。",
          banSuccess: "用户封禁成功",
          unbanSuccess: "用户解封成功",
          updateRoleSuccess: "用户角色更新成功",
          updateRoleFailed: "用户角色更新失败"
        }
      },
      banDialog: {
        title: "封禁用户",
        description: "您确定要封禁 {userName} 吗？他们将无法访问应用程序。"
      },
      unbanDialog: {
        title: "解封用户",
        description: "您确定要解封 {userName} 吗？他们将重新获得访问权限。"
      },
      form: {
        title: "用户信息",
        description: "请在下方输入用户详细信息",
        labels: {
          name: "姓名",
          email: "邮箱",
          password: "密码",
          confirmPassword: "确认密码",
          role: "角色",
          image: "头像",
          phoneNumber: "手机号",
          emailVerified: "邮箱已验证",
          phoneVerified: "手机已验证",
          banned: "已封禁",
          banReason: "封禁原因",
          referralCode: "推荐码",
          referredByCode: "邀请人",
          commissionBalance: "佣金余额"
        },
        placeholders: {
          name: "请输入用户姓名",
          email: "请输入用户邮箱",
          password: "请输入密码（至少8位）",
          confirmPassword: "请确认密码",
          selectRole: "请选择角色",
          image: "https://example.com/avatar.jpg",
          phoneNumber: "请输入手机号",
          banReason: "封禁原因（可选）"
        },
        validation: {
          nameRequired: "姓名不能为空",
          emailRequired: "邮箱不能为空",
          emailInvalid: "请输入有效的邮箱地址",
          passwordRequired: "密码不能为空",
          passwordMinLength: "密码至少需要8位字符",
          passwordMismatch: "两次输入的密码不一致",
          roleRequired: "请选择角色"
        }
      },
      deleteDialog: {
        title: "删除用户",
        description: "您确定要删除此用户吗？此操作无法撤销，将永久删除用户账户和所有相关数据。"
      },
      messages: {
        createSuccess: "用户创建成功",
        updateSuccess: "用户更新成功",
        deleteSuccess: "用户删除成功",
        fetchError: "获取用户信息失败",
        operationFailed: "操作失败",
        deleteError: "删除用户失败"
      }
    },
    orders: {
      title: "订单管理",
      actions: {
        createOrder: "创建订单"
      },
      messages: {
        fetchError: "加载订单失败，请重试。"
      },
      table: {
        noResults: "未找到订单。",
        search: {
          searchBy: "搜索条件...",
          searchPlaceholder: "按{field}搜索...",
          filterByStatus: "按状态筛选",
          allStatus: "所有状态",
          filterByProvider: "支付方式",
          allProviders: "所有支付方式",
          pending: "待支付",
          paid: "已支付",
          failed: "支付失败",
          refunded: "已退款",
          canceled: "已取消",
          stripe: "Stripe",
          wechat: "微信支付",
          creem: "Creem",
          alipay: "支付宝",
          dodo: "Dodo Payments",
          waffo: "Waffo"
        },
        columns: {
          id: "订单ID",
          user: "用户",
          amount: "金额",
          plan: "计划",
          status: "状态",
          provider: "支付方式",
          providerOrderId: "支付平台订单ID",
          createdAt: "创建时间",
          actions: "操作"
        },
        actions: {
          viewOrder: "查看订单",
          refundOrder: "退款",
          openMenu: "打开菜单",
          actions: "操作",
          clickToCopy: "点击复制"
        },
        sort: {
          ascending: "升序排列",
          descending: "降序排列",
          none: "取消排序"
        }
      },
      status: {
        pending: "待支付",
        paid: "已支付",
        failed: "支付失败",
        refunded: "已退款",
        canceled: "已取消"
      }
    },
    blog: {
      title: "博客管理",
      subtitle: "创建和管理博客文章",
      createPost: "创建文章",
      editPost: "编辑文章",
      actions: {
        newPost: "新建文章"
      },
      messages: {
        fetchError: "加载博客文章失败，请重试。",
        createSuccess: "文章创建成功",
        updateSuccess: "文章更新成功",
        deleteSuccess: "文章删除成功",
        deleteError: "删除文章失败",
        operationFailed: "操作失败",
        uploadSuccess: "上传成功",
        uploadError: "上传失败"
      },
      table: {
        noResults: "未找到文章。",
        search: {
          searchPlaceholder: "按标题搜索...",
          filterByStatus: "按状态筛选",
          allStatus: "所有状态",
          draft: "草稿",
          published: "已发布"
        },
        columns: {
          title: "标题",
          status: "状态",
          author: "作者",
          publishedAt: "发布时间",
          createdAt: "创建时间",
          actions: "操作"
        },
        actions: {
          edit: "编辑",
          delete: "删除"
        },
        sort: {
          ascending: "升序排列",
          descending: "降序排列",
          none: "取消排序"
        }
      },
      form: {
        title: "文章信息",
        description: "请在下方输入文章详情",
        labels: {
          title: "标题",
          slug: "URL 别名",
          excerpt: "摘要",
          coverImage: "封面图",
          status: "状态",
          content: "内容"
        },
        placeholders: {
          title: "请输入文章标题",
          slug: "URL 友好别名（根据标题自动生成）",
          excerpt: "文章简要摘要",
          coverImage: "拖放或点击上传（最大 2MB）",
          content: "使用 Markdown 编写内容..."
        }
      },
      deleteDialog: {
        title: "删除文章",
        description: "您确定要删除此文章吗？此操作无法撤销，将永久删除该文章。"
      }
    },
    credits: {
      title: "积分交易记录",
      subtitle: "查看所有用户的积分收入和消耗记录",
      messages: {
        fetchError: "加载积分交易记录失败，请重试。"
      },
      table: {
        noResults: "未找到积分交易记录。",
        search: {
          searchBy: "搜索条件...",
          searchPlaceholder: "按{field}搜索...",
          filterByType: "按类型筛选",
          allTypes: "所有类型",
          purchase: "购买",
          consumption: "消耗",
          refund: "退款",
          bonus: "奖励",
          adjustment: "调整"
        },
        columns: {
          id: "交易ID",
          user: "用户",
          type: "类型",
          amount: "金额",
          balance: "余额",
          description: "描述",
          createdAt: "创建时间",
          metadata: "元数据"
        },
        actions: {
          clickToCopy: "点击复制",
          viewDetails: "查看详情"
        },
        sort: {
          ascending: "升序排列",
          descending: "降序排列",
          none: "取消排序"
        },
        pagination: {
          showing: "显示第 {start} 到 {end} 条，共 {total} 条结果",
          pageInfo: "第 {current} 页，共 {total} 页"
        }
      },
      type: {
        purchase: "购买",
        consumption: "消耗",
        refund: "退款",
        bonus: "奖励",
        adjustment: "调整"
      }
    },
    subscriptions: {
      title: "订阅管理",
      description: "管理用户订阅和账单",
      actions: {
        createSubscription: "创建订阅"
      },
      messages: {
        fetchError: "加载订阅失败，请重试。"
      },
      table: {
        showing: "显示第 {from} 到 {to} 项，共 {total} 项结果",
        noResults: "未找到订阅。",
        rowsPerPage: "每页行数",
        page: "第",
        of: "页，共",
        view: "查看",
        toggleColumns: "切换列",
        goToFirstPage: "转到第一页",
        goToPreviousPage: "转到上一页", 
        goToNextPage: "转到下一页",
        goToLastPage: "转到最后一页",
        search: {
          searchLabel: "搜索订阅",
          searchField: "搜索字段",
          statusLabel: "状态",
          providerLabel: "提供商",
          search: "搜索",
          clear: "清除",
          allStatuses: "所有状态",
          allProviders: "所有提供商",
          stripe: "Stripe",
          creem: "Creem",
          wechat: "微信支付",
          alipay: "支付宝",
          dodo: "Dodo Payments",
          waffo: "Waffo",
          userEmail: "用户邮箱",
          subscriptionId: "订阅ID",
          userId: "用户ID",
          planId: "计划ID",
          stripeSubscriptionId: "Stripe订阅ID",
          creemSubscriptionId: "Creem订阅ID",
          dodoSubscriptionId: "Dodo订阅ID",
          waffoOrderId: "Waffo订单ID",
          placeholders: {
            userEmail: "输入用户邮箱...",
            subscriptionId: "输入订阅ID...",
            userId: "输入用户ID...",
            planId: "输入计划ID...",
            stripeSubscriptionId: "输入Stripe订阅ID...",
            creemSubscriptionId: "输入Creem订阅ID...",
            dodoSubscriptionId: "输入Dodo订阅ID...",
            waffoOrderId: "输入Waffo订单ID...",
            default: "输入搜索词..."
          },
          searchBy: "搜索条件...",
          searchPlaceholder: "按{field}搜索...",
          filterByStatus: "按状态筛选",
          filterByProvider: "按提供商筛选",
          allStatus: "所有状态",
          filterByPaymentType: "支付类型",
          allPaymentTypes: "所有类型",
          active: "活跃",
          canceled: "已取消",
          expired: "已过期",
          trialing: "试用中",
          inactive: "未激活",
          oneTime: "一次性",
          recurring: "循环订阅"
        },
        columns: {
          id: "订阅ID",
          user: "客户",
          plan: "计划",
          status: "状态",
          paymentType: "支付类型",
          provider: "提供商",
          periodStart: "开始时间",
          periodEnd: "结束时间",
          cancelAtPeriodEnd: "将取消",
          createdAt: "创建时间",
          updatedAt: "更新时间",
          metadata: "元数据",
          period: "周期",
          actions: "操作"
        },
        actions: {
          openMenu: "打开菜单",
          actions: "操作",
          viewSubscription: "查看订阅",
          cancelSubscription: "取消订阅",
          clickToCopy: "点击复制"
        },
        sort: {
          ascending: "升序排列",
          descending: "降序排列",
          none: "取消排序"
        }
      },
      status: {
        active: "活跃",
        trialing: "试用中",
        canceled: "已取消",
        cancelled: "已取消",
        expired: "已过期",
        inactive: "未激活"
      },
      paymentType: {
        one_time: "一次性",
        recurring: "循环订阅"
      }
    },
    pricing: {
      title: "定价方案管理",
      description: "管理应用的动态定价方案",
      createPlan: "创建方案",
      editPlan: "编辑方案",
      updatePlan: "更新方案",
      importStatic: "从配置导入",
      importing: "导入中...",
      importSuccess: "成功从静态配置导入方案",
      importConfirm: "确定要从静态配置导入所有方案吗？此操作不会删除现有的动态方案。",
      deletePlan: "删除方案",
      confirmDelete: "确定要停用此方案吗？",
      noPlans: "暂无方案，请创建或从静态配置导入。",
      localeCoverageWarning: "警告：部分语言区域没有配置活跃的定价方案，该区域用户将看到空白的定价页面。",
      tabs: {
        subscription: "订阅方案",
        credits: "积分套餐",
      },
      table: {
        name: "名称",
        provider: "提供商",
        price: "价格",
        type: "类型",
        locales: "适用语言",
        status: "状态",
        actions: "操作",
        allLocales: "全部",
      },
      fields: {
        provider: "支付提供商",
        amount: "价格",
        originalPrice: "原价（划线价）",
        currency: "币种",
        durationType: "时长类型",
        durationMonths: "时长（月）",
        credits: "积分数量",
        recommended: "推荐",
        active: "启用",
        locales: "适用语言",
        stripePriceId: "Stripe Price ID",
        paypalPlanId: "PayPal Plan ID",
        creemProductId: "Creem Product ID",
        dodoProductId: "Dodo Product ID",
        waffoProductId: "Waffo Product ID",
      },
      backToList: "返回方案列表",
      savePlan: "保存方案",
      saving: "保存中...",
      sections: {
        planInfo: "方案信息",
        planInfoDesc: "定义方案在各语言下的名称、描述和功能特性",
        pricing: "定价设置",
        pricingDesc: "设置支付提供商、金额和定价模式",
        providerConfig: "提供商配置",
        providerConfigDesc: "输入支付提供商后台的产品或价格 ID",
        noProviderConfig: "当前提供商无需额外配置 ID。",
        displaySettings: "展示设置",
        displaySettingsDesc: "控制此方案在定价页面上的显示方式和范围",
      },
      form: {
        providerIds: "支付商 ID",
        english: "English",
        chinese: "中文",
        name: "名称",
        description: "描述",
        durationLabel: "时长标签",
        features: "功能特性（Markdown）",
        localesHint: "逗号分隔，留空则对所有用户显示",
        originalPricePlaceholder: "留空表示无折扣",
        durationEnPlaceholder: "month / lifetime / one-time",
        durationZhPlaceholder: "月 / 终身 / 一次性",
        localesPlaceholder: "en, zh-CN",
      },
      mode: {
        static: "静态模式",
        dynamic: "动态模式",
        switchWarning: "切换定价模式需要设置 PRICING_MODE 环境变量并重启应用。",
      },
    },
    commissions: {
      title: "佣金记录",
      description: "查看所有推荐佣金记录",
      search: "按邮箱搜索...",
      noData: "暂无佣金记录",
      total: "条记录",
      table: {
        referrer: "推荐人",
        buyer: "购买者",
        orderAmount: "订单金额",
        rate: "佣金比例",
        commission: "佣金金额",
        status: "状态",
        date: "日期",
        columns: {
          id: "ID",
          referrer: "推荐人",
          referrerEmail: "推荐人邮箱",
          referrerName: "推荐人姓名",
          orderId: "订单 ID",
          orderAmount: "订单金额",
          rate: "比例",
          commission: "佣金",
          status: "状态",
          date: "日期"
        },
        search: {
          searchBy: "搜索字段",
          searchPlaceholder: "搜索 {field}...",
          filterByStatus: "按状态筛选"
        }
      },
      noResults: "暂无佣金记录",
      filter: {
        allStatus: "全部状态",
        credited: "已入账",
        pending: "待处理",
        withdrawn: "已提现",
        cancelled: "已取消",
        filterByStatus: "按状态筛选"
      }
    },
    withdrawals: {
      title: "提现管理",
      description: "管理用户提现申请",
      search: "按邮箱搜索...",
      noData: "暂无提现申请",
      total: "条申请",
      table: {
        user: "用户",
        amount: "金额",
        method: "方式",
        account: "账号",
        status: "状态",
        adminNote: "管理员备注",
        processedAt: "处理时间",
        processedBy: "处理人",
        date: "日期",
        actions: "操作",
        columns: {
          id: "ID",
          user: "用户",
          userEmail: "用户邮箱",
          userName: "用户姓名",
          amount: "金额",
          method: "方式",
          paymentAccount: "收款账号",
          status: "状态",
          adminNote: "管理员备注",
          processedAt: "处理时间",
          date: "日期",
          actions: "操作"
        },
        search: {
          searchBy: "搜索字段",
          searchPlaceholder: "搜索 {field}...",
          filterByStatus: "按状态筛选"
        }
      },
      noResults: "暂无提现申请",
      actions: {
        approve: "通过",
        reject: "拒绝",
        markProcessing: "标记处理中"
      },
      dialog: {
        title: "处理提现",
        note: "管理员备注",
        notePlaceholder: "输入备注（可选）",
        confirm: "确认"
      },
      filter: {
        allStatus: "全部状态",
        pending: "待处理",
        processing: "处理中",
        completed: "已完成",
        rejected: "已拒绝",
        filterByStatus: "按状态筛选"
      }
    }
  },
  pricing: {
    metadata: {
      title: "TinyShip - 定价方案",
      description: "选择最适合您需求的完美方案。灵活的定价选项包括月度、年度和终身订阅，享受高级功能。",
              keywords: "定价, 方案, 订阅, 月度, 年度, 终身, 高级, 功能"
    },
    title: "定价",
    subtitle: "一次集成，打通国内外支付",
    description: "国内外主流支付渠道全部内置接通。订阅制与积分制并存，选择最适合你业务的收费方式。",
    cta: "立即开始",
    allProviders: "全部",
    noPlans: "该支付方式下暂无此类套餐。",
    docsLink: "查看支付文档",
    providers: {
      stripe: "Stripe",
      paypal: "PayPal",
      creem: "Creem",
      dodo: "Dodo",
      waffo: "Waffo",
      wechat: "微信支付",
      alipay: "支付宝"
    },
    recommendedBadge: "推荐选择",
    lifetimeBadge: "一次购买，终身使用",
    creditsBadge: "积分包",
    creditsUnit: "积分",
    tabs: {
      subscription: "订阅套餐",
      credits: "积分充值",
      affiliate: "推广返利",
      withdrawal: "提现"
    },
    features: {
      securePayment: {
        title: "多渠道安全支付",
        description: "支持微信支付、Stripe、Creem 等多种企业级安全支付方式"
      },
      flexibleSubscription: {
        title: "灵活付费模式",
        description: "传统订阅或 AI 时代积分制，任你选择"
      },
      globalCoverage: {
        title: "全球支付覆盖",
        description: "多币种和地区支付方式，为全球用户提供便捷支付体验"
      }
    },
    plans: {
      monthly: {
        name: "月度订阅",
        description: "灵活管理，按月付费",
        duration: "月",
        features: {
          "所有高级功能": "所有高级功能",
          "优先支持": "优先支持"
        }
      },
      yearly: {
        name: "年度订阅",
        description: "年付更优惠",
        duration: "年",
        features: {
          "所有高级功能": "所有高级功能",
          "优先支持": "优先支持",
          "两个月免费": "两个月免费"
        }
      },
      lifetime: {
        name: "终身会员",
        description: "一次付费，永久使用",
        duration: "终身",
        features: {
          "所有高级功能": "所有高级功能",
          "优先支持": "优先支持",
          "终身免费更新": "终身免费更新"
        }
      }
    }
  },
  payment: {
    metadata: {
      success: {
        title: "TinyShip - 支付成功",
        description: "您的支付已成功处理。感谢您的订阅，欢迎使用我们的高级功能。",
        keywords: "支付, 成功, 订阅, 确认, 高级功能"
      },
      cancel: {
        title: "TinyShip - 支付已取消",
        description: "您的支付已被取消。您可以重新尝试支付或联系我们的客服团队获取帮助。",
        keywords: "支付, 取消, 重试, 客服, 订阅"
      }
    },
    result: {
      success: {
        title: "支付成功",
        description: "您的支付已成功处理。",
        actions: {
          viewSubscription: "查看订阅",
          backToHome: "返回首页"
        }
      },
      cancel: {
        title: "支付已取消",
        description: "您的支付已被取消。",
        actions: {
          tryAgain: "重试",
          contactSupport: "联系客服",
          backToHome: "返回首页"
        }
      },
      failed: "支付失败，请重试"
    },
    steps: {
      initiate: "初始化",
      initiateDesc: "准备支付",
      scan: "扫码",
      scanDesc: "请扫描二维码",
      pay: "支付",
      payDesc: "确认支付"
    },
    scanQrCode: "请使用微信扫描二维码完成支付",
    confirmCancel: "您的支付尚未完成，确定要取消吗？",
    orderCanceled: "您的订单已取消"
  },
  subscription: {
    metadata: {
      title: "TinyShip - 我的订阅",
      description: "在您的订阅仪表板中管理订阅计划、查看账单历史和更新付款方式。",
              keywords: "订阅, 账单, 支付, 计划, 管理, 仪表板"
    },
    title: "我的订阅",
    overview: {
      title: "订阅概览",
      planType: "计划类型",
      status: "状态",
      active: "已激活",
      startDate: "开始日期",
      endDate: "结束日期",
      progress: "订阅进度"
    },
    management: {
      title: "订阅管理",
      description: "通过客户门户管理您的订阅、查看账单历史和更新付款方式。",
      manageSubscription: "管理订阅",
      changePlan: "更改计划",
      redirecting: "正在跳转..."
    },
    noSubscription: {
      title: "未找到有效订阅",
      description: "您当前没有活跃的订阅计划。",
      viewPlans: "查看订阅计划"
    }
  },
  dashboard: {
    metadata: {
      title: "TinyShip - 仪表盘",
      description: "在您的个性化仪表盘中管理账户、订阅和个人资料设置。",
              keywords: "仪表盘, 账户, 个人资料, 订阅, 设置, 管理"
    },
    title: "仪表盘",
    description: "管理您的账户和订阅",
    profile: {
      title: "个人信息",
      noNameSet: "未设置姓名",
      role: "角色:",
      emailVerified: "邮箱已验证",
      editProfile: "编辑个人资料",
      updateProfile: "更新个人资料",
      cancel: "取消",
      form: {
        labels: {
          name: "姓名",
          email: "邮箱地址",
          image: "头像图片链接"
        },
        placeholders: {
          name: "请输入您的姓名",
          email: "邮箱地址",
          image: "https://example.com/your-image.jpg"
        },
        emailReadonly: "邮箱地址无法修改",
        imageDescription: "可选：输入您的头像图片链接"
      },
      updateSuccess: "个人资料更新成功",
      updateError: "更新个人资料失败，请重试"
    },
    subscription: {
      title: "订阅状态",
      status: {
        lifetime: "终身会员",
        active: "有效",
        canceled: "已取消",
        cancelAtPeriodEnd: "期末取消",
        pastDue: "逾期",
        unknown: "未知",
        noSubscription: "无订阅"
      },
      paymentType: {
        recurring: "循环订阅",
        oneTime: "一次性"
      },
      lifetimeAccess: "您拥有终身访问权限",
      expires: "到期时间:",
      cancelingNote: "您的订阅将不会续订，并将在以下时间结束:",
      noActiveSubscription: "您当前没有有效的订阅",
      manageSubscription: "管理订阅",
      viewPlans: "查看套餐"
    },
    credits: {
      title: "积分余额",
      available: "可用积分",
      totalPurchased: "累计获得",
      totalConsumed: "累计消耗",
      recentTransactions: "最近交易",
      buyMore: "购买更多积分",
      types: {
        purchase: "充值",
        bonus: "赠送",
        consumption: "消耗",
        refund: "退款",
        adjustment: "调整"
      },
      descriptions: {
        ai_chat: "AI 对话",
        ai_body_edit: "AI 体型编辑",
        body_edit_trial: "体型编辑试用积分",
        ai_image_generation: "AI 图像生成",
        ai_video_generation: "AI 视频生成",
        image_generation: "图片生成",
        document_processing: "文档处理",
        purchase: "积分充值",
        bonus: "赠送积分",
        refund: "积分退款",
        adjustment: "管理员调整",
        referral_signup_bonus: "推荐注册奖励",
        referral_referrer_bonus: "推荐人奖励"
      },
      table: {
        type: "类型",
        description: "描述",
        amount: "数量",
        time: "时间"
      }
    },
    affiliate: {
      title: "推广返利",
      description: "邀请好友注册，赚取佣金",
      referralLink: "您的推荐链接",
      copyLink: "复制链接",
      copied: "已复制！",
      bonusFailed: "推荐关系已绑定，但注册奖励发放失败。",
      claimFailed: "认领推荐码失败。",
      commissionBalance: "佣金余额",
      commissionRate: "佣金比例",
      totalCommission: "累计佣金",
      totalReferrals: "推荐人数",
      paidReferrals: "已付费推荐",
      signupBonus: "注册奖励",
      referrerBonus: "每成功推荐一位用户注册，您将获得 {amount} 积分",
      refereeBonus: "被推荐用户将获得 {amount} 积分",
      noReferrals: "暂无推荐记录",
      noCommissions: "暂无佣金记录",
      referralsTab: "推荐用户",
      commissionsTab: "佣金记录",
      table: {
        user: "用户",
        email: "邮箱",
        joinDate: "注册时间",
        buyer: "购买用户",
        orderAmount: "订单金额",
        rate: "佣金比例",
        commission: "佣金金额",
        status: "状态",
        date: "日期"
      },
      status: {
        pending: "待处理",
        credited: "已入账",
        withdrawn: "已提现",
        cancelled: "已取消"
      }
    },
    withdrawal: {
      title: "提现",
      description: "提取您的佣金余额",
      balance: "可提现余额",
      amount: "金额",
      amountPlaceholder: "请输入提现金额",
      paymentMethod: "收款方式",
      selectMethod: "选择收款方式",
      paymentAccount: "收款账号",
      accountPlaceholder: "请输入收款账号",
      submit: "申请提现",
      minAmount: "最低提现金额：{amount}",
      history: "提现记录",
      noHistory: "暂无提现记录",
      methods: {
        alipay: "支付宝",
        paypal: "PayPal",
        bank_transfer: "银行转账"
      },
      status: {
        pending: "待处理",
        processing: "处理中",
        completed: "已完成",
        rejected: "已拒绝"
      },
      table: {
        amount: "金额",
        method: "方式",
        account: "账号",
        status: "状态",
        date: "日期",
        note: "备注"
      }
    },
    account: {
      title: "账户信息",
      memberSince: "注册时间",
      phoneNumber: "手机号码"
    },
    orders: {
      title: "订单历史",
      status: {
        pending: "待支付",
        paid: "已支付",
        failed: "支付失败",
        refunded: "已退款",
        canceled: "已取消"
      },
      provider: {
        stripe: "Stripe",
        wechat: "微信支付",
        creem: "Creem",
        alipay: "支付宝",
        dodo: "Dodo Payments",
        waffo: "Waffo"
      },
      noOrders: "没有找到订单",
      noOrdersDescription: "您还没有下过任何订单",
      viewAllOrders: "查看所有订单",
      orderDetails: {
        orderId: "订单ID",
        amount: "金额",
        plan: "计划",
        status: "状态",
        provider: "支付方式",
        createdAt: "创建时间"
      },
      recent: {
        title: "最近订单",
        showingRecent: "显示最近 {count} 个订单"
      },
      page: {
        title: "所有订单",
        description: "查看和管理您的所有订单",
        backToDashboard: "返回仪表盘",
        totalOrders: "共 {count} 个订单"
      }
    },
    linkedAccounts: {
      title: "关联账户",
      connected: "已连接",
      connectedAt: "关联时间:",
      noLinkedAccounts: "暂无关联账户",
      providers: {
        credential: "邮箱密码",
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
        apple: "Apple",
        discord: "Discord",
        wechat: "微信",
        "phone-number": "手机号"
      }
    },
    tabs: {
      profile: {
        title: "个人资料",
        description: "管理您的个人信息和头像"
      },
      account: {
        title: "账户管理",
        description: "密码修改、关联账户和账户安全"
      },
      security: {
        title: "安全设置",
        description: "密码和安全设置"
      },
      subscription: {
        description: "管理您的订阅计划和付费功能"
      },
      credits: {
        title: "积分",
        description: "查看积分余额和交易记录"
      },
      orders: {
        description: "查看您的订单历史和交易记录"
      },
      content: {
        profile: {
          title: "个人资料",
          subtitle: "这是您在网站上向其他人展示的信息。",
          username: {
            label: "用户名",
            value: "shadcn",
            description: "这是您的公开显示名称。可以是您的真实姓名或昵称。您只能每30天更改一次。"
          },
          email: {
            label: "邮箱",
            placeholder: "选择要显示的已验证邮箱",
            description: "您可以在邮箱设置中管理已验证的邮箱地址。"
          }
        },
        account: {
          title: "账户设置",
          subtitle: "管理您的账户设置和偏好。",
          placeholder: "账户设置内容..."
        },
        security: {
          title: "安全设置",
          subtitle: "管理您的密码和安全设置。",
          placeholder: "安全设置内容..."
        }
      }
    },
    quickActions: {
      title: "快速操作",
      editProfile: "编辑资料",
      accountSettings: "账户设置",
      subscriptionDetails: "订阅详情",
      getSupport: "获取帮助",
      viewDocumentation: "查看文档"
    },
    accountManagement: {
      title: "账户管理",
      changePassword: {
        title: "更改密码",
        description: "更新您的账户密码",
        oauthDescription: "社交登录账户无法更改密码",
        button: "更改密码",
        dialogDescription: "请输入您当前的密码并选择新密码",
        form: {
          currentPassword: "当前密码",
          currentPasswordPlaceholder: "请输入当前密码",
          newPassword: "新密码",
          newPasswordPlaceholder: "请输入新密码（至少8个字符）",
          confirmPassword: "确认新密码",
          confirmPasswordPlaceholder: "请再次输入新密码",
          cancel: "取消",
          submit: "更新密码"
        },
        success: "密码更新成功",
        errors: {
          required: "请填写所有必填字段",
          mismatch: "两次输入的新密码不一致",
          minLength: "密码长度至少为8个字符",
          failed: "密码更新失败，请重试"
        }
      },
      deleteAccount: {
        title: "删除账户",
        description: "永久删除您的账户及所有相关数据",
        button: "删除账户",
        confirmTitle: "删除账户",
        confirmDescription: "您确定要删除您的账户吗？",
        warning: "⚠️ 此操作无法撤销",
        consequences: {
          data: "您的所有个人数据将被永久删除",
          subscriptions: "活跃订阅将被取消",
          access: "您将失去所有高级功能的访问权限"
        },
        form: {
          cancel: "取消",
          confirm: "是的，删除我的账户"
        },
        success: "账户删除成功",
        errors: {
          failed: "删除账户失败，请重试"
        }
      }
    },
    roles: {
      admin: "管理员",
      user: "普通用户"
    }
  },
  premiumFeatures: {
    metadata: {
      title: "TinyShip - 高级功能",
      description: "探索您的订阅包含的所有高级功能。访问高级工具、AI 助手和增强功能。",
      keywords: "高级功能, 功能, 高级, 工具, 订阅, 权益, 增强"
    },
    title: "高级功能",
    description: "感谢您的订阅！以下是您现在可以使用的所有高级功能。",
    loading: "加载中...",
    subscription: {
      title: "您的订阅",
      description: "当前订阅状态和详细信息",
      status: "订阅状态",
      type: "订阅类型",
      expiresAt: "到期时间",
      active: "已激活",
      inactive: "未激活",
      lifetime: "终身会员",
      recurring: "周期性订阅"
    },
    badges: {
      lifetime: "终身会员"
    },
    demoNotice: {
      title: "🎯 SaaS 模板演示页面",
      description: "这是一个用于测试路由保护的演示页面。只有付费用户才能访问此页面，展示了如何在您的 SaaS 应用中实现订阅级别的访问控制。"
    },
    features: {
      userManagement: {
        title: "高级用户管理",
        description: "完整的用户档案管理和自定义设置"
      },
      aiAssistant: {
        title: "AI 智能助手",
        description: "先进的人工智能功能，提升工作效率"
      },
      documentProcessing: {
        title: "无限文档处理",
        description: "处理任意数量和大小的文档文件"
      },
      dataAnalytics: {
        title: "详细数据分析",
        description: "深入的数据分析和可视化报表"
      }
    },
    actions: {
      accessFeature: "访问功能"
    }
  },
  ai: {
    metadata: {
      title: "TinyShip - AI 助手",
      description: "与强大的 AI 模型互动，包括 GPT-4、通义千问和 DeepSeek。获得编程、写作和问题解决的 AI 帮助。",
              keywords: "AI, 助手, 聊天机器人, GPT-4, 人工智能, 机器学习, 对话"
    },
    chat: {
      title: "AI 助手",
      description: "一个大模型对话简单实现，可扩展设计，使用了最新的技术 ai-sdk / ai-elements / streamdown 实现非常丝滑的聊天效果，可以按需求扩展为更复杂的功能",
      placeholder: "需要我帮什么忙？",
      sending: "发送中...",
      thinking: "AI 正在思考...",
      noMessages: "开始与 AI 助手对话",
      welcomeMessage: "你好！我是你的 AI 助手。今天我能为你做些什么？",
      toolCall: "工具调用",
      providers: {
        title: "AI 提供商",
        openai: "OpenAI",
        qwen: "通义千问",
        deepseek: "DeepSeek"
      },
      models: {
        "gpt-5.6-sol": "GPT-5.6 Sol",
        "gpt-5.6-terra": "GPT-5.6 Terra",
        "gpt-5.6-luna": "GPT-5.6 Luna",
        "qwen3.8-max": "通义千问 3.8 Max",
        "qwen3.7-plus": "通义千问 3.7 Plus",
        "qwen3.7-flash": "通义千问 3.7 Flash",
        "deepseek-v4-pro": "DeepSeek V4 Pro",
        "deepseek-v4-flash": "DeepSeek V4 Flash"
      },
      actions: {
        send: "发送",
        copy: "复制",
        copied: "已复制！",
        retry: "重试",
        dismiss: "关闭",
        newChat: "新对话",
        clearHistory: "清空历史"
      },
      errors: {
        failedToSend: "发送消息失败，请重试。",
        networkError: "网络错误，请检查网络连接。",
        invalidResponse: "AI 响应无效，请重试。",
        rateLimited: "请求过于频繁，请稍后再试。",
        subscriptionRequired: "AI 功能需要有效订阅",
        subscriptionRequiredDescription: "升级到付费计划以使用 AI 聊天功能",
        insufficientCredits: "积分不足",
        insufficientCreditsDescription: "使用 AI 聊天需要积分或订阅，请购买积分以继续使用。"
      },
      history: {
        title: "聊天记录",
        empty: "暂无聊天记录",
        today: "今天",
        yesterday: "昨天",
        thisWeek: "本周",
        older: "更早"
      }
    },
    image: {
      metadata: {
        title: "TinyShip - AI 图像生成",
        description: "使用 AI 生成精美图像。支持通义千问图像、fal.ai Flux、OpenAI DALL-E 和 Google Gemini。",
        keywords: "AI, 图像生成, DALL-E, Flux, 通义千问, Gemini, 文生图, 艺术, 创意"
      },
      title: "AI 图像生成",
      description: "使用多种 AI 提供商从文本提示生成精美图像",
      defaultPrompt: "一只黄色拉布拉多带着黑色金色圆墨镜在成都的场馆和两只黄白猫喝茶",
      prompt: "提示词",
      promptPlaceholder: "描述您想要生成的图像...",
      negativePrompt: "负面提示词",
      negativePromptPlaceholder: "描述您不希望在图像中出现的内容...",
      negativePromptHint: "描述需要避免在生成图像中出现的元素",
      generate: "生成",
      generating: "生成中...",
      generatedSuccessfully: "图像生成成功！",
      download: "下载",
      result: "结果",
      idle: "空闲",
      preview: "预览",
      json: "JSON",
      whatNext: "接下来您想做什么？",
      costInfo: "本次请求将花费",
      perMegapixel: "每百万像素",
      credits: "积分",
      providers: {
        title: "提供商",
        qwen: "阿里云百炼",
        fal: "fal.ai",
        openai: "OpenAI",
        gemini: "Google Gemini"
      },
      models: {
        "qwen-image-3.0-pro": "通义千问图像 3.0 Pro",
        "qwen-image-3.0": "通义千问图像 3.0",
        "reve/2.1/text-to-image": "Reve 2.1",
        "bytedance/seedream/v5/pro/text-to-image": "Seedream 5.0 Pro",
        "fal-ai/flux-2-pro": "FLUX.2 Pro",
        "gpt-image-2": "GPT Image 2",
        "gemini-3.1-flash-image-preview": "Nano Banana 2",
        "gemini-3-pro-image-preview": "Nano Banana Pro"
      },
      settings: {
        title: "附加设置",
        showMore: "更多",
        showLess: "收起",
        imageSize: "图像尺寸",
        imageSizeHint: "选择宽高比和分辨率",
        numInferenceSteps: "推理步数",
        numInferenceStepsHint: "步数越多质量越高，但速度越慢",
        guidanceScale: "引导强度",
        guidanceScaleHint: "控制生成图像与提示词的匹配程度",
        seed: "种子",
        seedHint: "使用相同的种子可以复现结果",
        random: "随机",
        randomize: "随机生成",
        promptExtend: "提示词扩展",
        promptExtendHint: "AI 将增强和扩展您的提示词",
        watermark: "水印",
        watermarkHint: "在生成的图像上添加通义千问水印",
        syncMode: "同步模式",
        syncModeHint: "返回 base64 数据而非 URL"
      },
      errors: {
        generationFailed: "图像生成失败",
        invalidPrompt: "请输入有效的提示词",
        insufficientCredits: "积分不足",
        insufficientCreditsDescription: "生成图像需要积分，请购买积分以继续。",
        networkError: "网络错误，请检查您的连接。",
        unknownError: "发生未知错误"
      }
    },
    video: {
      metadata: {
        title: "TinyShip - AI 视频生成",
        description: "使用 AI 生成精彩视频。支持 fal.ai、火山引擎 Seedance 和阿里云万象。",
        keywords: "AI, 视频生成, 文生视频, Seedance, 万象, Luma, 创意"
      },
      title: "AI 视频生成",
      description: "使用多种 AI 提供商从文本提示生成精彩视频",
      defaultPrompt: "猫猫从腿上直接跳跃到沙发上",
      prompt: "提示词",
      model: "模型",
      promptPlaceholder: "描述您想要生成的视频...",
      generate: "生成视频",
      generating: "视频生成中...",
      generatedSuccessfully: "视频生成成功！",
      download: "下载视频",
      result: "结果",
      idle: "输入提示词以生成视频",
      whatNext: "接下来您想做什么？",
      credits: "积分",
      providers: {
        title: "提供商",
        fal: "fal.ai",
        volcengine: "火山引擎",
        aliyun: "阿里云万象"
      },
      models: {
        "fal-ai/kling-video/v3/pro/text-to-video": "Kling 3.0 Pro 文生视频",
        "fal-ai/kling-video/v3/pro/image-to-video": "Kling 3.0 Pro 图生视频",
        "fal-ai/veo3.1": "Veo 3.1 文生视频",
        "fal-ai/veo3.1/image-to-video": "Veo 3.1 图生视频",
        "doubao-seedance-2-5-260628": "豆包 Seedance 2.5",
        "doubao-seedance-2-0-260128": "豆包 Seedance 2.0",
        "wan3.0-video": "万相 3.0",
        "wan3.0-video-prime": "万相 3.0 Prime"
      },
      inputMode: {
        label: "生成模式",
        text: "文生视频",
        firstFrame: "首帧",
        firstLastFrame: "首尾帧",
        firstLastFrameUnsupported: "当前提供商仅支持首帧"
      },
      frameInput: {
        title: "帧图输入",
        hint: "可直接填写 URL，或上传到 Cloudflare R2。",
        firstFrameUrl: "首帧 URL",
        lastFrameUrl: "尾帧 URL",
        upload: "上传",
        uploadedToR2: "帧图已上传到 R2",
        preview: "图片预览",
        previewAlt: "首帧预览"
      },
      settings: {
        title: "高级设置",
        videoSize: "视频尺寸 / 宽高比",
        videoSizePlaceholder: "选择尺寸",
        videoSizeHint: "选择分辨率或宽高比",
        duration: "时长（秒）",
        durationHint: "生成视频的长度",
        seed: "种子",
        seedHint: "使用相同种子可以复现结果",
        random: "随机",
        loop: "循环",
        loopHint: "视频是否无缝循环播放",
        motionStrength: "运动强度",
        motionStrengthHint: "控制视频中运动的幅度",
        promptExtend: "提示词扩展",
        promptExtendHint: "AI 将自动增强和扩展您的提示词",
        watermark: "水印",
        watermarkHint: "在生成的视频上添加水印"
      },
      errors: {
        generationFailed: "视频生成失败",
        invalidPrompt: "请输入有效的提示词",
        firstFrameRequired: "请先提供首帧 URL",
        lastFrameRequired: "请先提供尾帧 URL",
        unsupportedImageType: "仅支持 JPEG/JPG/PNG/WEBP/BMP 图像",
        imageTooLarge: "图像大小不能超过 10MB",
        uploadFailed: "上传失败",
        unsupportedModeForProvider: "当前提供商不支持此生成模式",
        insufficientCredits: "积分不足",
        insufficientCreditsDescription: "生成视频需要积分，请购买积分以继续。",
        networkError: "网络错误，请检查您的连接。",
        unknownError: "发生未知错误",
        timeout: "视频生成超时，请重试。"
      },
      resultPanel: {
        generatingHint: "视频生成通常需要 1-5 分钟...",
        videoTagUnsupported: "您的浏览器不支持 video 标签。"
      }
    }
  },
  home: {
    metadata: {
      title: "AI Body Editor | 在线照片体型与比例编辑",
      description: "使用瘦身、增肌、比例调整或胸部调整编辑穿着衣物的人像。选择强度，生成 AI 编辑结果，比较并下载照片。"
    },
    nav: {
      tryFree: "编辑照片",
      tools: "工具",
      toolsDescription: "照片编辑指南"
    },
    hero: {
      badge: "AI 照片编辑",
      title: "AI Body Editor",
      subtitle: "选择照片、编辑模式与强度。生成结果，与原图比较，再下载照片。",
      note: "仅限穿着衣物的成年人照片 · 首次游客编辑免费 · 结果私有存储"
    },
    examples: {
      title: "试试真实案例",
      selectorLabel: "选择编辑案例",
      chooseLabel: "试试{name}",
      settingsOnly: "仅应用设置",
      previousExamples: "向前查看案例",
      nextExamples: "查看更多案例",
      sampleResult: "已保存的案例结果",
      loadingSample: "正在载入样照…",
      original: "原图",
      result: "结果",
      photoViews: "照片视图",
      settingsTitle: "编辑设置",
      emptyHint: "上传自己的照片，或选择顶部案例，试用其照片和设置。",
      resultPlaceholder: "编辑后的照片将在这里显示",
      resultPlaceholderHint: "选择设置后，点击“编辑照片”生成结果。",
      currentSettingsDiffer: "设置已更改，再次生成以更新结果。",
      sampleNote: "这是本编辑器根据 AI 成年人样照实际生成的结果。点击“编辑照片”按当前设置重新生成。",
      reviewResult: "下载前请检查面部、衣服和背景细节。",
      labels: {
        naturalSlim: "自然瘦身",
        muscle: "运动体型",
        proportions: "比例平衡",
        breast: "丰胸 · 饱满",
        breastSubtle: "丰胸 · 自然",
        legProportions: "修长双腿",
        shoulders: "仅加宽肩膀",
        waistOnly: "仅瘦腰",
        fullerFigure: "稍微饱满",
        customCombination: "肩膀 + 腰部"
      }
    },
    realResults: {
      "title": "本编辑器的真实生成结果",
      "description": "查看四种编辑模式与具体修改要求的实际效果。原图为 AI 生成的成年人样照，结果由本编辑器实际生成。效果因照片而异。",
      "coverage": "{cases} 组案例 · {people} 位样照人物 · {modes} 种编辑模式",
      "before": "原图",
      "after": "实际结果",
      "compareLabel": "比较样照原图与编辑器实际生成结果",
      "try": "试用此案例",
      "tryLabel": "在编辑器中试用{name}",
      "intensity": "强度 {value}/100",
      "requestLabel": "修改说明：",
      "showMore": "展开另外 4 组案例",
      "showLess": "收起更多案例",
      "naturalSlim": {
        "title": "自然的整体瘦身",
        "description": "日常衣着下，对腰部、手臂与大腿进行整体瘦身。",
        "beforeAlt": "AI 成年女性样照原图：穿梅紫色 T 恤与炭灰色运动裤，站在城市庭院中",
        "afterAlt": "实际瘦身模式结果：同一位穿梅紫色 T 恤与炭灰色运动裤的庭院女性",
        "instructions": ""
      },
      "muscle": {
        "title": "更强健的运动体型",
        "description": "运动 T 恤与短裤搭配下，使用肌肉预设调整肩部、上臂与胸部。",
        "beforeAlt": "AI 成年男性样照原图：穿橄榄色运动 T 恤与灰色运动短裤，站在跑道上",
        "afterAlt": "实际肌肉模式结果：同一位橄榄色 T 恤与短裤男性呈现更强健的运动体型",
        "instructions": ""
      },
      "proportions": {
        "title": "更修长的腿身比例",
        "description": "使用比例预设调整腿身平衡与腰线。",
        "beforeAlt": "AI 成年黑人男性样照原图：穿象牙白 Polo 衫与海军蓝短裤，站在现代广场中",
        "afterAlt": "实际比例模式结果：同一位象牙白 Polo 衫与蓝色短裤黑人男性的腿身比例得到调整",
        "instructions": ""
      },
      "breast": {
        "title": "衣着下更饱满的胸部",
        "description": "较高强度的胸部模式，展示原有圆领 T 恤下的实际变化。",
        "beforeAlt": "AI 成年女性样照原图：穿奶油色 T 恤与咖色长裤，站在露台上",
        "afterAlt": "实际胸部模式结果：同一件奶油色 T 恤下呈现更饱满的胸部轮廓",
        "instructions": ""
      },
      "shoulders": {
        "title": "只让肩膀更宽",
        "description": "将修改范围限定在肩部宽度，而非整体增肌。",
        "beforeAlt": "AI 成年男性样照原图：穿蓝绿色 T 恤与海军蓝长裤，站在浅灰色摄影棚中",
        "afterAlt": "实际肌肉模式结果：同一位蓝绿色 T 恤男性应用仅调整肩部的说明",
        "instructions": "只让肩膀明显更宽、更有运动感。腰部、胸部、手臂和腿保持原来的大小。衣服、脸部、姿势和背景保持不变。"
      },
      "legProportions": {
        "title": "按说明调整腿部比例",
        "description": "短裙让腿部线条更直观，额外说明指定需要保留原宽度的身体部位。",
        "beforeAlt": "AI 成年女性样照原图：穿象牙白上衣与酒红色及膝短裙，站在浅灰摄影棚中",
        "afterAlt": "实际比例模式结果：同一位象牙白上衣与酒红色短裙女性应用腿部比例修改要求",
        "instructions": "让腿相对于躯干略长一些，保持自然平衡的成年人比例。腰、臀、胸和手臂保留原有宽度。衣服、脸部、姿势和背景保持不变。"
      },
      "breastSubtle": {
        "title": "更温和的胸部调整",
        "description": "使用另一位穿圆领连衣裙的人物，展示强度 40 的胸部编辑。",
        "beforeAlt": "AI 成年东亚女性样照原图：黑色头发，穿深绿色及膝连衣裙，站在日光门廊上",
        "afterAlt": "实际胸部模式结果：同一位深绿色及膝连衣裙东亚女性的强度 40 编辑",
        "instructions": ""
      },
      "waistOnly": {
        "title": "只瘦腰，保留其他部位",
        "description": "在瘦身模式中指定仅修改腰部。",
        "beforeAlt": "AI 成年男性样照原图：穿绿色背心与深色长裤，站在健身房中",
        "afterAlt": "实际瘦身模式结果：对同一位绿色背心男性应用仅瘦腰的额外说明",
        "instructions": "只让腰部明显变细。手臂、腿、肩膀和胸部保持原来的大小，其余内容保持不变。"
      },
      "fullerFigure": {
        "title": "整体稍微增重",
        "description": "通过额外说明改变预设方向，请求更饱满的体型。",
        "beforeAlt": "AI 成年金发女性样照原图：穿黑色无袖上衣与铁锈橙及膝裙，站在石质庭院中",
        "afterAlt": "实际比例模式结果：同一位黑色上衣与铁锈橙半裙金发女性应用整体稍微增重的要求",
        "instructions": "让整体体型稍微饱满一些，自然轻微增重：腰、上臂、臀部和大腿稍微丰满，不要瘦任何部位。保持健康自然的成年人比例，衣服、脸部、姿势和背景保持不变。"
      },
      "customCombination": {
        "title": "一次说明，组合两种修改",
        "description": "同时请求肩膀更宽与腰部略细。",
        "beforeAlt": "AI 成年白人男性样照原图：赤褐色头发、姜色胡须，穿炭灰色 T 恤与浅色运动短裤，站在露台上",
        "afterAlt": "实际肌肉模式结果：同一位炭灰色 T 恤与浅色短裤白人男性应用肩部与腰部的组合修改",
        "instructions": "让肩膀更宽、腰部略细，形成更清晰的倒三角躯干。手臂、胸部和腿保持原来的大小。衣服、脸部、姿势和背景保持不变。"
      }
    },
    showcase: {
      eyebrow: "瘦身、增肌与比例调整",
      heroCta: "编辑照片",
      examplesCta: "查看示例",
      conceptLabel: "AI 生成的概念示意图",
      conceptNotice: "概念示意图用于说明编辑方向，并非本应用生成的编辑结果。",
      compareLabel: "比较原始与编辑后的概念示意图",
      compareHint: "拖动以比较",
      before: "原始概念图",
      after: "编辑概念图",
      modesLabel: "了解编辑方向",
      sampleLabel: "试试示例照片",
      sampleNotice: "示例是 AI 生成的概念图。点击“编辑照片”才能生成新的编辑结果。",
      clearSample: "清除示例",
      examplesTitle: "更多编辑概念",
      examplesSubtitle: "通过更多人像，了解各个编辑方向。",
      previewTitle: "编辑你的照片",
      previewSubtitle: "选择照片、模式与强度。首次免登录免费生成编辑结果，再比较并下载。",
      detailTitle: "下载前检查编辑结果",
      detailSubtitle: "对照原图，检查面部、衣物和背景。",
      detailFace: "面部与表情",
      detailClothes: "衣物与接缝",
      detailBackground: "背景线条",
      detailFaceHint: "检查五官和表情是否仍然自然。",
      detailClothesHint: "留意接缝、面料细节与衣物覆盖范围。",
      detailBackgroundHint: "检查墙面、门框等直线是否弯曲。",
      detailNotice: "AI 编辑也可能改变未要求修改的细节，保存前请检查整张图片。",
      closingTitle: "从一张喜欢的照片开始",
      closingDescription: "选择照片和编辑方向。首次免费生成、比较并下载结果。",
      pricingNote: "AI 编辑使用积分。游客可免登录免费编辑一次，后续编辑需登录并使用账户积分。",
      modes: {
        slim: {
          label: "瘦身",
          title: "更纤细的身形轮廓",
          description: "了解穿着衣物的人像在腰部、腹部与上臂明显收窄后呈现的轮廓。",
          cta: "预览瘦身模式",
          beforeAlt: "瘦身原始概念图：成年女性穿奶油色 T 恤与深咖色长裤，站在有绿植的暖白色露台上",
          afterAlt: "瘦身编辑概念图：同一位穿奶油色 T 恤与深咖色长裤的女性在露台上，腰部、腹部与上臂明显收窄",
          secondaryBeforeAlt: "瘦身原始概念图：成年女性穿灰紫色长袖上衣与靛蓝牛仔裤，站在绿树环绕的社区街道上",
          secondaryAfterAlt: "瘦身编辑概念图：同一位穿灰紫色上衣与牛仔裤的女性在街道上，腰腹、上臂与大腿轮廓明显更加纤细"
        },
        muscle: {
          label: "增肌",
          title: "更明显的运动线条",
          description: "了解肩部、胸部与上臂更加饱满后呈现的运动身形轮廓。",
          cta: "预览增肌模式",
          beforeAlt: "增肌原始概念图：成年男性穿森林绿运动背心与炭灰色长裤，站在高窗采光的健身房中",
          afterAlt: "增肌编辑概念图：同一位穿绿色运动背心与炭灰色长裤的男性在健身房中，肩部、胸部与上臂明显更加饱满",
          secondaryBeforeAlt: "增肌原始概念图：成年男性穿蓝色 T 恤与橄榄绿束脚裤，站在有绿树与石栏杆的河畔公园小路上",
          secondaryAfterAlt: "增肌编辑概念图：同一位穿蓝色 T 恤与橄榄绿束脚裤的男性在河畔小路上，肩部明显更宽、胸部更饱满、上臂更粗壮"
        },
        proportions: {
          label: "比例调整",
          title: "更清晰的腰臀比例",
          description: "了解腰线更明显、臀部线条更均衡后，整体轮廓呈现的清晰变化。",
          cta: "预览比例调整模式",
          beforeAlt: "比例调整原始概念图：成年女性穿海军蓝连体裤，站在有赤陶色墙面与暖灰色地面的摄影棚中",
          afterAlt: "比例调整编辑概念图：同一位穿海军蓝连体裤的女性在摄影棚中，腰线明显更清晰，臀部线条更均衡",
          secondaryBeforeAlt: "比例调整原始概念图：成年女性穿鼠尾草绿针织上衣与铁锈色长裤，站在有灌木与自行车的砖墙庭院中",
          secondaryAfterAlt: "比例调整编辑概念图：同一位穿鼠尾草绿上衣与铁锈色长裤的女性在庭院中，腰部明显收窄，臀部轮廓更加饱满"
        }
      },
      preparation: {
        title: "选择清晰的原始照片",
        description: "使用穿着衣物的成年人照片，光线均匀，并在人物周围留出空间。",
        linkBefore: "关于照片选择的建议，请阅读 ",
        linkText: "Body Editor",
        linkAfter: " 指南。"
      },
      privacy: {
        title: "照片处理与私有结果",
        description: "选择照片只会创建本地预览。提交编辑后，照片会发送至兔子 API 进行处理，结果仅当前游客浏览器或已登录账户可访问。"
      }
    },
    upload: {
      inputLabel: "上传照片以编辑",
      dropTitle: "将照片拖到这里，或点击选择",
      dropHint: "JPG、PNG 或 WebP · 最大 10 MB",
      modeLabel: "选择编辑类型",
      modes: {
        slim: "瘦身",
        muscle: "增肌",
        proportions: "比例调整",
        breast: "胸部调整"
      },
      submit: "编辑照片",
      replace: "选择另一张照片",
      previewAlt: "你选择的照片的预览",
      errors: {
        type: "请选择 JPG、PNG 或 WebP 图片。",
        size: "这张照片超过了 10 MB。"
      },
      availability: "选择模式与强度，首次免登录免费生成编辑结果。",
      comingSoon: "选择模式与强度，然后免费生成首张游客编辑照片。"
    },
    editing: {
      intensityLabel: "调整强度",
      intensityLow: "轻微",
      intensityHigh: "很强",
      intensityValue: "强度 {value}，满分 100",
      intensityHint: "点击生成后应用。",
      instructionsToggle: "额外修改说明（选填）",
      instructionsLabel: "额外身体修改说明",
      instructionsPlaceholder: "只收细腰部，手臂和腿部保持不变。",
      instructionsExample: "例如：让肩膀稍微宽一点。",
      instructionsHint: "修改说明在生成时生效，轮廓预览仅反映模式和强度。",
      instructionsCounter: "{count}/{max} 字符",
      contourPreview: {
        analyzing: "正在识别身体轮廓…",
        unavailable: "轮廓预览暂不可用，你仍可以生成编辑效果。",
        noPerson: "未识别到清晰的身体轮廓。可换一张更清晰的照片，或继续生成。",
        chestUnclear: "胸部大致作用区域；遮挡处无法预测轮廓。可通过“校准”调整位置。",
        area: "胸部区域",
        original: "原始轮廓",
        target: "目标轮廓",
        note: "目标轮廓示意 · AI 实际效果可能不同。",
        show: "显示轮廓",
        hide: "隐藏轮廓",
        adjust: "校准轮廓位置",
        adjustShort: "校准",
        done: "完成校准",
        doneShort: "完成",
        reset: "重置位置",
        alignmentHint: "拖动高亮区域或使用方向键对齐轮廓，仅调整预览示意。",
        alignmentHandle: "轮廓位置：拖动或使用方向键调整",
      },
      intensityDescriptions: {
        slim: "调整腰腹、手臂和大腿的纤细程度。",
        muscle: "增加肩膀、手臂和胸部的肌肉线条与体积。",
        proportions: "调整腿身比例，让腰线更明显。",
        breast: "在保留原有衣物的前提下增加胸部轮廓。"
      },
      pending: "正在编辑照片…",
      resultTitle: "你的编辑结果",
      loadingResult: "正在加载编辑后的照片…",
      resultLoadError: "编辑结果已保存，但预览未能加载。请重新加载图片。",
      reloadResult: "重新加载图片",
      before: "原图",
      after: "编辑后",
      beforeAlt: "本次编辑选择的原始照片",
      afterAlt: "所选照片的 AI 编辑结果",
      compareLabel: "比较原图与编辑后的照片",
      compareHint: "拖动以比较",
      download: "下载照片",
      editAnother: "编辑另一张照片",
      signinTitle: "登录以继续编辑",
      signinDescription: "登录后使用账户积分继续编辑。登录时会保留你选择的照片。",
      signinRequired: "登录以继续编辑",
      trialNote: "每个浏览器可免费完成一次游客编辑。",
      costNote: "每次编辑消耗 {credits} 积分。",
      guestUsedNote: "游客免费编辑已使用，登录后可使用账户积分继续编辑。",
      guestRetryNote: "免费编辑机会仍然可用，可在重试限额内再次尝试。",
      refunded: "本次编辑消耗的积分已退回。",
      checkEdit: "查看编辑状态",
      retry: "重试",
      errors: {
        TRIAL_EXHAUSTED: "游客免费编辑已使用，请登录以继续。",
        TRIAL_IN_PROGRESS: "此浏览器已有一项免费编辑正在处理，请等待完成。",
        RATE_LIMITED: "试用请求过于频繁，请稍后再试。",
        NOT_CONFIGURED: "编辑暂时不可用，请稍后再试。",
        INVALID_INPUT: "请选择不超过 10 MB 的有效 JPG、PNG 或 WebP 照片，以及模式和强度。",
        INVALID_INSTRUCTIONS: "额外修改说明请使用不超过 500 字符的纯文本，移除不支持的控制字符后重试。",
        UNAUTHENTICATED: "请登录以继续编辑照片。",
        UNAUTHORIZED: "请登录以继续编辑照片。",
        FORBIDDEN: "你无权访问这次编辑。",
        INVALID_ORIGIN: "请在本网站打开编辑器并提交照片。",
        INSUFFICIENT_CREDITS: "积分不足，无法进行本次编辑。",
        CONFLICT: "此请求已用于其他照片或设置，请发起新的编辑。",
        IDEMPOTENCY_CONFLICT: "此请求已用于其他照片或设置，请发起新的编辑。",
        UPSTREAM_ERROR: "图像服务未能完成本次编辑。",
        TIMEOUT: "编辑超时，请先查看状态再重试。",
        CANCELLED: "本次编辑已取消。",
        INVALID_RESPONSE: "图像服务返回的结果无法使用。",
        OUTPUT_TOO_LARGE: "生成的图片超过大小限制。",
        ASYNC_RESPONSE: "图像服务返回了尚未完成的任务，请查看编辑状态。",
        RESULT_UNAVAILABLE: "编辑结果未能保存或加载。",
        STORAGE_ERROR: "编辑结果未能保存或加载。",
        NOT_FOUND: "未找到本次编辑。",
        UNKNOWN: "未能完成编辑，请重试。",
        INTERNAL_ERROR: "未能完成编辑，请重试。",
        NETWORK: "连接中断，请先查看编辑状态再重试。"
      }
    },
    modeGuide: {
      cta: "使用{mode}模式",
      descriptions: {
        slim: "收窄腰部、腹部、上臂和大腿轮廓。",
        muscle: "增强肩部、手臂与胸部的肌肉线条。",
        proportions: "调整腿身比例与腰线。",
        breast: "调整原有衣物下的胸部轮廓，使其更饱满。"
      }
    },
    features: {
      title: "选择想要调整的部位",
      subtitle: "先选模式，再调整强度或添加具体修改说明。",
      items: [
        {
          key: "slim",
          title: "更纤细的轮廓",
          description: "规划轻微的整体轮廓变化。清晰的身体边缘，以及人物周围留出的空间，有助于判断照片。",
          linkBefore: "关于纤细轮廓的照片建议，请阅读 ",
          linkText: "skinny filter",
          linkAfter: " 指南。"
        },
        {
          key: "muscle",
          title: "更清晰的肌肉线条",
          description: "选择增肌模式，让原有衣物下的运动线条更明显。比较结果时留意姿势、肩部与手臂。",
          linkBefore: "关于人像选择和体型调整，请阅读 ",
          linkText: "body editor",
          linkAfter: " 指南。"
        },
        {
          key: "proportions",
          title: "协调的身材比例",
          description: "决定调整前，先观察完整轮廓。拍摄位置和衣物会影响肩部、躯干与腿部在照片中的比例。",
          linkBefore: "关于穿着衣物的人像中的胸部比例，请阅读 ",
          linkText: "AI breast expansion",
          linkAfter: " 指南。"
        },
        {
          key: "batch",
          title: "照片准备",
          description: "选择身体边缘清晰、光线均匀、人物周围有空间的人像。合适的原图让你更容易判断调整目标。",
          linkBefore: "在 ",
          linkText: "body editor",
          linkAfter: " 指南中了解照片选择技巧。"
        }
      ]
    },
    howItWorks: {
      title: "从一张照片开始",
      steps: [
        {
          title: "选择照片",
          description: "选择清晰的、穿着衣物的成年人照片，格式为 JPG、PNG 或 WebP，大小不超过 10 MB。"
        },
        {
          title: "选择模式",
          description: "选择瘦身、增肌、比例调整或胸部调整，再用滑杆设置 1–100 的调整强度。"
        },
        {
          title: "生成并比较",
          description: "点击“编辑照片”。将结果与原图比较，检查细节，再下载图片。"
        }
      ]
    },
    action: {
      title: "编辑效果构想",
      subtitle: "用于展示编辑方向的 AI 概念插图。",
      before: "调整前",
      after: "调整后",
      items: [
        {
          key: "slim",
          beforeAlt: "瘦身模式的占位插图，展示简单的人体轮廓",
          afterAlt: "瘦身模式的另一张占位插图，展示相同的人体轮廓",
          caption: "瘦身目标：更纤细的身体轮廓"
        },
        {
          key: "muscle",
          beforeAlt: "增肌模式的占位插图，展示简单的人体轮廓",
          afterAlt: "增肌模式的另一张占位插图，展示相同的人体轮廓",
          caption: "增肌目标：更清晰的上身线条"
        },
        {
          key: "proportions",
          beforeAlt: "比例调整模式的占位插图，展示简单的人体轮廓",
          afterAlt: "比例调整模式的另一张占位插图，展示相同的人体轮廓",
          caption: "比例调整目标：协调整体轮廓"
        }
      ]
    },
    rating: {
      placeholder: "评分占位（仅开发环境）：启用 aggregateRating 前需添加真实评价。"
    },
    why: {
      title: "为什么选择 aibodyeditor.net",
      items: [
        {
          title: "一个编辑器，四种模式",
          description: "首页和指南使用同一个 AI Body Editor，提供瘦身、增肌、比例调整和胸部调整。"
        },
        {
          title: "实用的照片建议",
          description: "了解如何选择人像、确定体型调整目标，以及评估编辑时应检查哪些细节。"
        },
        {
          title: "提交前先预览",
          description: "选择照片时只在本地预览。提交编辑后才发送照片进行 AI 处理，结果通过当前游客浏览器或已登录账户访问。"
        }
      ]
    },
    pricing: {
      title: "价格",
      subtitle: "游客可免登录免费编辑一次，后续编辑需登录并使用账户积分。",
      free: {
        name: "游客试用",
        detail: "每个浏览器免费编辑一次 · 无需登录"
      },
      packs: {
        starter: "入门",
        pro: "专业"
      },
      credits: "{credits} 积分",
      neverExpire: "积分永不过期",
      comingSoon: "价格即将公布",
      ctaFree: "编辑照片",
      ctaPack: "开始使用"
    },
    faq: {
      title: "常见问题",
      items: [
        {
          question: "如何编辑照片？",
          answer: "选择不超过 10 MB 的 JPG、PNG 或 WebP 照片，选择瘦身、增肌、比例调整或胸部调整，再设置强度。首次免登录免费生成编辑结果，即可比较和下载。"
        },
        {
          question: "想让轮廓更纤细，该选哪个模式？",
          answer: "选择瘦身模式来收窄腰部和上臂轮廓。强度滑杆控制期望的调整幅度，实际结果取决于原图。"
        },
        {
          question: "增肌模式用于什么？",
          answer: "增肌模式用于增强原有衣物下的肩部与手臂线条。选择强度后，检查生成结果中的身体结构和衣物细节是否自然。"
        },
        {
          question: "如何选择适合自然编辑的照片？",
          answer: "使用清晰、光线均匀、人物周围有空间的人像。可见的衣物缝线和背景线条，有助于之后判断变化是否协调。"
        },
        {
          question: "编辑一次需要多少积分？",
          answer: "游客每个浏览器可免费成功编辑一次，并受重试与网络限额约束。后续编辑需登录，每次使用 15 积分；登录不额外赠送试用。游客编辑失败会恢复机会，付费编辑失败会退回积分。"
        },
        {
          question: "可以同时编辑多张照片吗？",
          answer: "一次编辑一张照片。需要继续时选择另一张照片，暂不支持视频或批量编辑。"
        },
        {
          question: "照片何时会上传？",
          answer: "选择照片只会创建本地预览。点击“编辑照片”提交后，照片会上传并由兔子 API 处理。结果仅当前游客浏览器或已登录账户可访问，应用不持久保存上传的原图。"
        },
        {
          question: "可以在手机上编辑吗？",
          answer: "可以。在手机浏览器中选择照片，生成结果。无需安装应用，就能比较和下载。"
        }
      ]
    },
    tools: {
      title: "照片编辑指南",
      items: [
        {
          key: "bodyEditor",
          title: "Body Editor",
          description: "选择人像、规划体型调整，了解需要检查的细节。"
        },
        {
          key: "skinnyFilter",
          title: "Skinny Filter",
          description: "为轻微的瘦身效果选择照片、观察比例。"
        },
        {
          key: "breastExpansion",
          title: "AI Breast Expansion",
          description: "使用胸部调整模式呈现更丰满的衣物下胸部轮廓，并检查衣物与比例。"
        }
      ]
    },
    footer: {
      copyright: "© {year} AI Body Editor. 保留所有权利。",
      toolsTitle: "工具",
      siteNavLabel: "网站导航",
      homeLinkText: "AI Body Editor"
    }
  },
  toolPages: {
    common: {
      breadcrumbLabel: "面包屑导航",
      homeName: "AI Body Editor",
      relatedTitle: "相关指南",
      homeLinkText: "AI body editor",
      homeLinkDescription: "在同一个 AI Body Editor 中编辑照片，了解四种模式。",
      editorIntro: "所有指南都使用同一个 AI Body Editor，提供瘦身、增肌、比例调整、胸部调整及连续强度滑杆。"
    },
    bodyEditor: {
      keyword: "body editor",
      metadata: {
        title: "Body Editor | 照片体型调整与人像选择指南",
        description: "使用 Body Editor 的四种模式与连续强度滑杆调整穿着衣物的人像。生成 AI 编辑结果，与原图比较并下载照片。"
      },
      breadcrumb: "Body Editor",
      hero: {
        title: "Body Editor",
        subtitle: "选择合适的人像，明确体型调整目标，了解评估变化时需要检查的细节。",
        note: "仅限穿着衣物的成年人照片 · 四种模式 · 连续强度滑杆 · 首次游客编辑免费"
      },
      what: {
        title: "什么是体型编辑器？",
        paragraphs: [
          "体型编辑器调整人物在照片中呈现的轮廓。常见目标包括更纤细的外形、更清晰的肌肉线条，或不同的上下身比例。先确定一个明确目标：你在意照片中的哪一点，它来自姿势、穿搭，还是你想探索的体型变化？",
          "选择原图往往比计划调整多少更重要。手机靠身体过近、站姿扭转，或外套遮住腰部，都可能让比例难以判断。可以与一张在舒适距离拍摄的人像比较。如果问题主要来自拍摄角度，重新拍摄可能比调整一张不合适的照片更有用。",
          "对于穿搭照，你可能想让轮廓更协调，同时保留衣物的垂坠方式。对于健身人像，目标可能是探索更清晰的线条。将目标限定在照片本身：编辑后的图片无法展示身体会如何随训练改变，也无法确认一件衣服实际穿着时是否合身。",
          "在本网站，Body Editor 指南和首页使用同一个 AI Body Editor。选择瘦身、增肌、比例调整或胸部调整，再用滑杆设置 1–100 的调整强度。提交原图以生成编辑结果，将结果与原图比较，检查细节后再下载。下面的建议帮助你选择合适的原图并评估变化。"
        ],
        linkBefore: "在 ",
        linkAfter: " 首页可以了解产品，并使用相同的照片编辑器。",
        sibling: {
          key: "skinnyFilter",
          before: "如果目标是让整体轮廓更纤细，",
          after: " 指南提供了更多照片选择与轻微瘦身的建议。"
        },
        figure: {
          beforeAlt: "体型编辑概念插图，矩形框内是较宽的人体轮廓",
          afterAlt: "体型编辑概念插图，同一矩形框内是较窄的人体轮廓",
          caption: "体型调整构想：结合可见的背景细节观察身体轮廓。"
        }
      },
      howTo: {
        title: "如何编辑体型照片",
        steps: [
          {
            title: "选择清晰的人像",
            description: "选择清晰的 JPG、PNG 或 WebP 照片，大小不超过 10 MB，主体应为穿着衣物的成年人。全身照适合观察整体比例；半身照可以帮助评估躯干和肩部。"
          },
          {
            title: "检查可见轮廓",
            description: "人物周围应留有空间，与背景有清晰的边界。交叉的手臂、贴在腰部的包或过紧的裁切，可能遮住你想观察的形状。重要边缘缺失时，换一张照片。"
          },
          {
            title: "选择调整方向",
            description: "选择瘦身来收窄腰部与手臂，选择增肌来增强运动线条，选择比例调整来改变整体比例，或选择胸部调整来呈现更丰满的衣物下胸部轮廓。用滑杆设置 1–100 的调整强度，衣物或背景细节复杂时先用较小幅度。"
          },
          {
            title: "生成、比较并下载",
            description: "点击“编辑照片”，发送原图进行 AI 处理。结果生成后，拖动比较控件检查面部、手部、衣物与背景。满意后再下载。生成结果可能与期望的变化不同。"
          }
        ]
      },
      tips: {
        title: "体型编辑照片建议",
        items: [
          {
            title: "让姿势清晰易读",
            description: "选择能看清肩部、腰部和臀部的姿势。放松站立、手臂与躯干之间留有空间，比紧抱手臂更容易判断轮廓。想观察腿部比例时，将脚部保留在画面中。"
          },
          {
            title: "用细节作为参照",
            description: "衣物缝线、纽扣、地砖和门框有助于发现不协调的变化。除了身体，也要检查这些细节，留意变形图案、弯曲直线或位置不自然的手，使用较高强度时尤其需要注意。"
          },
          {
            title: "保留原图",
            description: "保存原始照片，以便之后比较编辑效果。先按日常观看大小判断整张图，再仔细检查边缘。对于一组照片，应结合不同姿势和拍摄角度，让人物外观保持协调。"
          }
        ]
      },
      faq: {
        title: "体型编辑常见问题",
        items: [
          {
            question: "Body Editor 和首页是不同工具吗？",
            answer: "不是。两页使用同一个 AI Body Editor，提供瘦身、增肌、比例调整、胸部调整及连续强度滑杆。本页补充照片选择和体型调整建议。"
          },
          {
            question: "现在可以用它调整体型吗？",
            answer: "可以。选择原始照片、模式与强度，点击“编辑照片”。编辑器会发送照片进行 AI 处理，并显示可比较和下载的结果。"
          },
          {
            question: "能单独控制各个身体部位吗？",
            answer: "可以选择瘦身、增肌、比例调整或胸部调整及连续强度滑杆。没有单独的腰部、臀部、手臂或腿部滑块，强度表示调整方向，并非精确的尺寸。"
          },
          {
            question: "该用全身照还是半身照？",
            answer: "想评估腿长或整体轮廓的协调性时，选择全身照。如果关注躯干或肩部，半身照也有参考价值。让你在意的部位完整可见。"
          },
          {
            question: "什么会让体型调整显得不协调？",
            answer: "改变后的轮廓可能与原来的姿势、衣物或背景不一致。评估编辑图片时，检查手部、衣物缝线和附近直线。幅度较大的变化更难与这些细节协调。"
          },
          {
            question: "可以使用别人的照片吗？",
            answer: "使用其他成年人的照片前，应取得本人同意。选择穿着衣物的人像，并在编辑或分享前商定想做的调整。"
          },
          {
            question: "我选择的照片会发送到哪里？",
            answer: "选择照片时只创建本地预览。提交编辑后，应用将原图发送至兔子 API 进行处理。结果仅当前游客浏览器或已登录账户可访问，应用不会持久保存上传的原图。"
          }
        ]
      },
      related: {
        description: "为同一个编辑器选择人像、规划体型调整并检查照片。"
      }
    },
    skinnyFilter: {
      keyword: "skinny filter",
      metadata: {
        title: "Skinny Filter | 瘦身照片与人像选择指南",
        description: "在 AI 体型编辑器中使用瘦身模式与连续强度滑杆。参考 Skinny Filter 照片建议，比较生成结果并下载照片。"
      },
      breadcrumb: "Skinny Filter",
      hero: {
        title: "Skinny Filter",
        subtitle: "通过照片选择和整体比例建议，规划更纤细、协调的人像轮廓。",
        note: "仅限穿着衣物的成年人照片 · 四种模式 · 连续强度滑杆 · 首次游客编辑免费"
      },
      what: {
        title: "什么是瘦身滤镜？",
        paragraphs: [
          "瘦身滤镜指让人物轮廓显得更纤细的照片效果。这个词涵盖多种调整，从轻微改变躯干，到收窄整个人像的轮廓。本指南关注如何选择合适的照片，以及规划与人物、姿势和穿搭相协调的小幅变化。",
          "决定哪里需要更纤细前，先观察原图。坐姿会使衣物在腰部形成褶皱。宽大的外套可能让上身显得更宽，贴着躯干的手臂也可能遮住腰部。同一次拍摄中的另一张照片，或许能更清楚地呈现轮廓，减少调整需要。",
          "适合参考的瘦身照片应在人身周围留有空间。站立人像尽量保留手和脚；坐姿照应让躯干容易辨认，衣物没有堆在一起。比较候选照片时保留原始构图，以便判断整张画面。",
          "瘦身模式属于首页和各指南共用的 AI Body Editor，用于收窄腰部与上臂轮廓。选择原图，用滑杆设置 1–100 的调整强度，生成结果。下载前将整张编辑照片与原图比较。需要增强肌肉线条、调整整体比例或衣物下的胸部轮廓时，可在同一个编辑器中选择其他模式。"
        ],
        linkBefore: "了解产品和其他模式，请访问 ",
        linkAfter: " 首页。",
        sibling: {
          key: "bodyEditor",
          before: "关于更广泛的体型调整目标和人像选择，请阅读 ",
          after: " 指南。"
        },
        figure: {
          beforeAlt: "瘦身滤镜概念插图，展示原始轮廓",
          afterAlt: "瘦身滤镜概念插图，展示较窄的轮廓",
          caption: "瘦身构想：规划变化时，比较完整的身体轮廓。"
        }
      },
      howTo: {
        title: "如何使用瘦身滤镜",
        steps: [
          {
            title: "选择合适的人像",
            description: "选择不超过 10 MB 的 JPG、PNG 或 WebP 照片。使用穿着衣物的成年人照片，轮廓清晰，身体周围有足够空间来判断比例。"
          },
          {
            title: "选择瘦身",
            description: "在共用编辑器中选择瘦身，再用滑杆设置 1–100 的调整强度。此设置会控制 AI 指令中期望的调整幅度。想先判断腰部和上臂的小幅变化时，从轻微开始。"
          },
          {
            title: "观察姿势与衣物",
            description: "结合整体画面检查腰部和手臂。衬衫褶皱或遮住躯干的手臂，可能就是当前轮廓的原因。如果调整目标难以判断，可以比较另一张图片。"
          },
          {
            title: "生成并保留参照",
            description: "点击“编辑照片”。结果生成后，与原图比较，结合腰部检查面部、手部与整体比例。检查衣物缝线和背景直线，确认变化适合这张人像后再下载。"
          }
        ]
      },
      tips: {
        title: "瘦身滤镜照片建议",
        items: [
          {
            title: "在轮廓周围留出空间",
            description: "过紧的裁切可能去掉判断轮廓所需的手肘或腿部。选择较宽的画面，在完整场景中观察人物。手臂和躯干间留出一点空隙，更容易看清腰部。"
          },
          {
            title: "结合整体看面部",
            description: "近距离人像难以展示整体体型。想调整身体轮廓时，选择包含躯干的照片。评估结果时，检查面部与整张人像是否协调，附近细节是否连贯。"
          },
          {
            title: "规划小幅变化",
            description: "明确描述想做的调整，例如略微收窄整体轮廓。不要只按一个部位有多细来判断照片，也要考虑姿势、衣物和上下身的比例。"
          }
        ]
      },
      faq: {
        title: "瘦身滤镜常见问题",
        items: [
          {
            question: "现在可以应用瘦身滤镜吗？",
            answer: "可以。选择照片、瘦身模式与强度，生成结果。同一个编辑器支持将编辑图片与原图比较，并下载照片。"
          },
          {
            question: "如何选择适合瘦身效果的照片？",
            answer: "选择躯干可见、衣物不遮挡轮廓的清晰人像。人物周围留出空间，并检查拍摄角度或姿势是否导致了你想调整的形状。"
          },
          {
            question: "这是 AI Body Editor 以外的另一个应用吗？",
            answer: "不是。本指南和首页使用同一个 AI Body Editor，提供瘦身、增肌、比例调整、胸部调整四种模式及连续强度滑杆。"
          },
          {
            question: "支持视频或批量照片吗？",
            answer: "编辑器一次接受一张不超过 10 MB 的 JPG、PNG 或 WebP 图片，不支持视频或批量编辑。需要继续时，选择另一张照片发起单独编辑。"
          },
          {
            question: "瘦身编辑一定自然吗？",
            answer: "这取决于原图和调整方式。衣物图案、身体比例和背景线条，都会影响编辑人像是否协调。保留原图，并比较完整画面。"
          },
          {
            question: "这些建议适用于不同性别吗？",
            answer: "适用。清晰的身体边缘、易于辨认的姿势和人物周围的空间，对任何穿着衣物的成年人人像都很有用。选择适合照片中人物的目标。"
          },
          {
            question: "可以使用裸露照片吗？",
            answer: "请仅使用穿着衣物的成年人照片。选择你有权使用和分享的图片。"
          }
        ]
      },
      related: {
        description: "为共用编辑器的瘦身模式选择照片、规划轻微变化。"
      }
    },
    breastExpansion: {
      keyword: "AI breast expansion",
      metadata: {
        title: "AI Breast Expansion | 穿着衣物的照片比例指南",
        description: "在 AI 体型编辑器中使用胸部调整模式编辑衣物下的胸部轮廓。选择强度，生成结果，比较细节并下载照片。"
      },
      breadcrumb: "AI Breast Expansion",
      hero: {
        title: "AI Breast Expansion",
        subtitle: "了解穿着衣物的人像中的胸部比例，选择合适的原图，并掌握需要检查的衣物细节。",
        note: "仅限穿着衣物的成年人照片 · 四种模式 · 连续强度滑杆 · 首次游客编辑免费"
      },
      what: {
        title: "什么是 AI 胸部比例调整？",
        paragraphs: [
          "AI 胸部调整用于让原有衣物下的胸部轮廓显得更丰满，目标是在保留领口、遮盖范围与姿势的同时调整衣物体积。本指南说明如何选择合适的人像并检查这些细节。在共用的 AI Body Editor 中选择胸部调整模式；需要更广泛的整体轮廓变化时，可以选择比例调整。",
          "决定变化前，先观察衣物。宽松衬衫可能遮住身体边缘，而有结构的外套可能保持自身形状。领口、缝线和褶皱反映衣物在原图中如何贴合。选择能看清这些细节的图片，便于之后进行有依据的比较。",
          "更饱满的轮廓也会改变上身与肩部、腰部和臀部在画面中的关系。包含躯干的人像比仅裁切胸部更有参考价值。保留人物姿势，并判断拍摄角度或布料的垂坠方式是否导致了你想调整的外观。",
          "编辑人像改变的是图片，不是身体。它无法预测身体变化或衣物在现实中的贴合情况。选择已获许可的、穿着衣物的成年人人像，设置胸部调整模式与强度，生成结果。先比较整张图片与原图，再观察胸部轮廓，并检查领口、衣褶、手部和周围背景。"
        ],
        linkBefore: "了解产品与四种模式，请访问 ",
        linkAfter: " 首页。",
        sibling: {
          key: "bodyEditor",
          before: "关于完整轮廓和人像选择，请阅读 ",
          after: " 指南。它使用同一个编辑器。"
        },
        figure: {
          beforeAlt: "胸部比例调整概念插图，展示原始上身轮廓",
          afterAlt: "胸部比例调整概念插图，展示较饱满的上身轮廓",
          caption: "比例调整构想：在完整人像中判断上身比例。"
        }
      },
      howTo: {
        title: "如何编辑衣物下的胸部轮廓",
        steps: [
          {
            title: "选择清晰的穿衣人像",
            description: "使用不超过 10 MB 的 JPG、PNG 或 WebP 成年人人像，人物应穿着衣物。保留肩部和腰部，结合整体判断上身。避免裁掉衣物边缘。"
          },
          {
            title: "检查衣物",
            description: "寻找可见的缝线、纽扣或布料褶皱。合体衣物能让轮廓更容易判断，厚重的叠穿可能遮住它。如果形状不清楚，换另一张照片。"
          },
          {
            title: "选择胸部调整与强度",
            description: "在共用编辑器中选择胸部调整，再用滑杆设置 1–100 的调整强度。AI 指令要求保留衣物覆盖与原有领口，但无法保证完全保留，仍需检查结果。"
          },
          {
            title: "生成并检查结果",
            description: "点击“编辑照片”。结果生成后，与原图比较肩部、腰部和臀部，检查领口与衣物缝线的褶皱是否连贯。下载前确认手部和背景仍显得自然。"
          }
        ]
      },
      tips: {
        title: "穿衣比例照片建议",
        items: [
          {
            title: "让领口与缝线清晰可见",
            description: "选择能看清衣物结构的照片。领口或一排纽扣可以作为具体参照。深色阴影、围巾和多层衣物可能让原始轮廓难以判断。"
          },
          {
            title: "保留完整躯干",
            description: "评估胸部比例时，让肩部和腰部留在画面中。只裁切胸部会去掉判断整体协调性所需的信息。先看完整人像，再关注局部。"
          },
          {
            title: "检查布料图案",
            description: "条纹、印花与缝线会暴露不协调的变化。检查生成结果中的图案，留意突兀弯折、缺失细节或与姿势不符的衣褶。衣物失真时，可尝试较低强度。"
          }
        ]
      },
      faq: {
        title: "AI 胸部比例调整常见问题",
        items: [
          {
            question: "现在可以生成 AI 胸部比例编辑吗？",
            answer: "可以。在共用编辑器中选择胸部调整模式与强度，选择穿着衣物的成年人人像，生成结果。下载前与原图比较，并检查衣物细节。"
          },
          {
            question: "哪种模式用于调整胸部轮廓？",
            answer: "选择胸部调整，用于让原有衣物下的胸部轮廓更丰满；选择比例调整，用于改变肩部、腰部和腿部的整体比例。两种模式都不提供精确罩杯或单独的身体部位滑块。"
          },
          {
            question: "本指南使用不同的编辑器吗？",
            answer: "不是。各指南和首页使用同一个 AI Body Editor，提供四种模式与连续强度滑杆。本指南补充衣物下胸部轮廓的建议。"
          },
          {
            question: "哪些衣物更容易判断比例？",
            answer: "选择轮廓、领口和缝线可见的衣物。合体上衣通常比厚重的多层穿搭更有参考价值。照片中保留足够的躯干部位，以观察衣物的贴合方式。"
          },
          {
            question: "编辑图片能预测实际身体变化吗？",
            answer: "照片编辑改变的是图片，不能预测实际身体变化，也不能展示变化后衣物是否合身。请将它作为视觉构想。"
          },
          {
            question: "可以使用其他人的照片吗？",
            answer: "仅在本人同意后，使用穿着衣物的成年人照片。编辑或分享前，商定想做的调整和图片用途。"
          },
          {
            question: "所选照片何时会上传？",
            answer: "选择照片时只在本地预览。提交编辑后，原图会发送至兔子 API 进行处理。结果仅当前游客浏览器或已登录账户可访问，应用不会持久保存上传的原图。"
          }
        ]
      },
      related: {
        description: "规划胸部比例照片编辑时的衣物和轮廓建议。"
      }
    }
  },
  notFound: {
    metadata: {
      title: "页面未找到 – AI Body Editor",
      description: "你访问的页面不存在。"
    },
    title: "页面未找到",
    description: "你访问的页面不存在或已被移动。",
    backHome: "返回首页"
  },
  validators: {
    user: {
      name: {
        minLength: "姓名至少需要{min}个字符",
        maxLength: "姓名不能超过{max}个字符"
      },
      email: {
        invalid: "请输入有效的邮箱地址"
      },
      image: {
        invalidUrl: "请输入有效的链接地址"
      },
      password: {
        minLength: "密码至少需要{min}个字符",
        maxLength: "密码不能超过{max}个字符",
        mismatch: "两次输入的密码不一致"
      },
      countryCode: {
        required: "请选择国家/地区"
      },
      phoneNumber: {
        required: "请输入手机号",
        invalid: "手机号格式不正确"
      },
      verificationCode: {
        invalidLength: "验证码必须是{length}位数字"
      },
      id: {
        required: "用户ID不能为空"
      },
      currentPassword: {
        required: "请输入当前密码"
      },
      confirmPassword: {
        required: "请确认密码"
      },
      deleteAccount: {
        confirmRequired: "您必须确认删除账户"
      }
    },
    blog: {
      title: {
        required: "标题不能为空",
        maxLength: "标题不能超过 {max} 个字符",
      },
      slug: {
        maxLength: "Slug 不能超过 {max} 个字符",
        invalid: "Slug 只能包含小写字母、数字和连字符",
      },
      excerpt: {
        maxLength: "摘要不能超过 {max} 个字符",
      },
      coverImage: {
        invalidUrl: "请输入有效的封面图片 URL",
      },
      status: {
        invalid: "状态必须是草稿或已发布",
      },
    },
    withdrawal: {
      amount: {
        required: "请输入提现金额",
        positive: "金额必须大于 0",
      },
      paymentMethod: {
        required: "请选择收款方式",
      },
      paymentAccount: {
        required: "请输入收款账号",
        maxLength: "收款账号不能超过 {max} 个字符",
      },
    },
  },
  countries: {
    china: "中国",
    usa: "美国", 
    uk: "英国",
    japan: "日本",
    korea: "韩国",
    singapore: "新加坡",
    hongkong: "香港",
    macau: "澳门",
    australia: "澳大利亚",
    france: "法国",
    germany: "德国",
    india: "印度",
    malaysia: "马来西亚",
    thailand: "泰国"
  },
  header: {
    navigation: {
      ai: "AI 功能演示",
      premiumFeatures: "高级会员功能",
      pricing: "定价",
      upload: "文件上传",
      demos: "功能演示",
      demosDescription: "探索示例功能",
      blog: "博客",
      affiliate: "推广返利"
    },
    demos: {
      ai: {
        title: "AI 对话",
        description: "大模型对话实现，可扩展设计，支持多个 Provider，需要购买积分使用"
      },
      aiImage: {
        title: "AI 图像生成",
        description: "AI 图像生成实现，可扩展设计，支持多个 Provider，需要购买积分使用"
      },
      aiVideo: {
        title: "AI 视频生成",
        description: "AI 视频生成实现，可扩展设计，支持多个 Provider，需要购买积分使用"
      },
      premium: {
        title: "高级会员功能",
        description: "路由保护演示页面，只有订阅付费用户才能访问此页面"
      },
      upload: {
        title: "文件上传",
        description: "文件上传实现，可扩展设计，支持多个 Provider，需要登录访问"
      }
    },
    auth: {
      signIn: "登录",
      getStarted: "开始使用",
      signOut: "退出登录"
    },
    userMenu: {
      dashboard: "控制台",
      profile: "个人资料",
      settings: "设置",
      personalSettings: "个人设置",
      adminPanel: "管理后台"
    },
    language: {
      switchLanguage: "切换语言",
      english: "English",
      chinese: "中文"
    },
    mobile: {
      themeSettings: "主题设置",
      languageSelection: "语言选择",
      openMenu: "打开主菜单"
    }
  },
  docs: {
    home: {
      title: "TinyShip Docs",
      subtitle: "基于 Fumadocs 构建",
      description: "基于 Fumadocs 的静态站点项目，适用于文档、博客和静态页面。",
      cta: {
        docs: "阅读文档",
        blog: "访问博客"
      }
    },
    nav: {
      docs: "文档",
      blog: "博客"
    },
    blog: {
      title: "博客",
      description: "来自 TinyShip 团队的最新文章和动态",
      allPosts: "所有文章",
      previousPage: "← 上一页",
      nextPage: "下一页 →",
      back: "← 返回博客",
      noPosts: "暂无文章"
    }
  },
  upload: {
    title: "上传文件",
    description: "上传图片到云存储",
    providerTitle: "存储服务商",
    providerDescription: "选择您偏好的云存储服务商",
    providers: {
      oss: "阿里云 OSS",
      ossDescription: "国内优化存储",
      s3: "Amazon S3",
      s3Description: "全球云存储",
      r2: "Cloudflare R2",
      r2Description: "零出口费用",
      cos: "腾讯云 COS",
      cosDescription: "国内云存储"
    },
    uploadTitle: "上传图片",
    uploadDescription: "拖拽图片或点击浏览。最大 1MB。",
    dragDrop: "拖拽文件到这里",
    orClick: "或点击浏览（最大 1MB）",
    browseFiles: "浏览文件",
    clearAll: "清除全部",
    uploadedTitle: "已上传文件",
    uploadedDescription: "成功上传 {count} 个文件",
    uploading: "上传中...",
    viewFile: "查看",
    uploaded: "已上传",
    errors: {
      maxFiles: "只能上传 1 个文件",
      imageOnly: "只允许上传图片文件",
      fileTooLarge: "文件大小必须小于 1MB"
    }
  },
  blog: {
    metadata: {
      title: "TinyShip - 博客",
      description: "阅读 TinyShip 团队的最新文章和动态。",
      keywords: "博客, 文章, 动态, TinyShip, SaaS"
    },
    title: "博客",
    subtitle: "最新文章和动态",
    readMore: "阅读更多",
    publishedOn: "发布于",
    by: "作者",
    noPosts: "暂无文章，请稍后再来！",
    backToBlog: "返回博客"
  }
} as const; 
