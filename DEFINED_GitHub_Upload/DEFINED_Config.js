(function (global) {
  'use strict';

  const CONFIG = {
    version: '2.0.0',
    designSystem: {
      source: 'DEFINED_Estimate_Studio.html',
      stylesheet: 'DEFINED_Design_System.css',
      version: '1.1.0',
      policy: 'All Studios inherit visual tokens and shared component styling from this stylesheet.'
    },
    storageKeys: {
      plan: 'defined.subscription.plan',
      adminPreview: 'defined.admin.preview'
    },
    brand: {
      name: 'DEFINED',
      category: 'Creative Tools',
      tagline: 'Build fast. Look premium.',
      taglineHtml: 'Build fast.<br>Look premium.',
      marketing: 'Purpose-built creative software for modern production teams.',
      accent: '#E65A23'
    },
    studios: {
      estimate: {
        id: 'estimate',
        name: 'Estimate Studio',
        liteName: 'Estimate Studio Lite',
        tagline: 'Know your worth. Price with confidence.',
        description: 'Price labor, crew, equipment, expenses, and scope in one guided production workflow.',
        status: 'available',
        file: 'DEFINED_Estimate_Studio.html',
        permission: 'estimate'
      },
      proposal: {
        id: 'proposal',
        name: 'Proposal Studio',
        tagline: 'Fast to build. Built to win.',
        description: 'Turn project details, scope, estimates, and terms into polished client-ready proposals.',
        status: 'available',
        file: 'DEFINED_Proposal_Studio.html',
        permission: 'proposal'
      },
      treatment: {
        id: 'treatment',
        name: 'Treatment Studio',
        tagline: 'Pitch the vision.',
        description: 'Shape visual direction, narrative, references, and creative intent into a compelling treatment.',
        status: 'coming_soon',
        file: null,
        permission: 'treatment'
      },
      producer: {
        id: 'producer',
        name: 'Producer Studio',
        tagline: 'Run the job.',
        description: 'Bring schedules, logistics, teams, documents, and production details into one operating space.',
        status: 'coming_soon',
        file: null,
        permission: 'producer'
      }
    },
    plans: {
      free: {
        id: 'free',
        name: 'Free',
        price: '$0',
        permissions: ['estimate_lite']
      },
      estimate: {
        id: 'estimate',
        name: 'Estimate Studio',
        price: '$19/mo',
        permissions: ['estimate', 'estimate_premium']
      },
      suite: {
        id: 'suite',
        name: 'DEFINED Suite',
        price: '$39/mo',
        permissions: ['estimate', 'estimate_premium', 'proposal', 'treatment', 'producer']
      },
      admin: {
        id: 'admin',
        name: 'Internal Preview',
        price: 'Development',
        permissions: ['estimate_lite', 'estimate', 'estimate_premium', 'proposal', 'treatment', 'producer', 'admin']
      }
    },
    copy: {
      badges: { lite: 'LITE', owned: 'OPEN', purchase: 'PURCHASE', comingSoon: 'COMING SOON', admin: 'Internal' },
      buttons: { open: 'Open Studio', upgrade: 'Upgrade', purchase: 'Purchase', close: 'Close', learnMore: 'Learn more' },
      upgrade: {
        freeEstimate: 'Unlock exports, brand controls, reusable presets, and the complete Estimate Studio workflow.',
        proposal: 'Purchase Proposal Studio to add the complete proposal workflow.',
        suite: 'Unlock every DEFINED Studio in one connected workspace.'
      },
      launcher: {
        heading: 'Studios',
        subheading: 'Launch every DEFINED Studio from one focused home.'
      }
    },
    launcher: {
      order: ['estimate', 'proposal', 'treatment', 'producer']
    }
  };

  const aliases = { lite: 'free', paid: 'estimate', defined_suite: 'suite' };
  function normalizePlan(value) {
    const id = aliases[String(value || '').toLowerCase()] || String(value || '').toLowerCase();
    return CONFIG.plans[id] ? id : 'free';
  }
  function queryPlan() {
    try { return new URLSearchParams(global.location.search).get('preview'); } catch (error) { return null; }
  }
  function getPlanId() {
    const requested = queryPlan();
    if (requested) return normalizePlan(requested);
    try { return normalizePlan(global.localStorage.getItem(CONFIG.storageKeys.plan)); } catch (error) { return 'free'; }
  }
  function setPlan(id) {
    const normalized = normalizePlan(id);
    try { global.localStorage.setItem(CONFIG.storageKeys.plan, normalized); } catch (error) {}
    return normalized;
  }
  function plan(id) { return CONFIG.plans[normalizePlan(id || getPlanId())]; }
  function can(permission, planId) {
    const active = plan(planId);
    return active.permissions.includes('admin') || active.permissions.includes(permission);
  }
  function studioState(studioId, planId) {
    const activePlan = normalizePlan(planId || getPlanId());
    const studio = CONFIG.studios[studioId];
    if (!studio) return { state: 'hidden', label: '' };
    if (studio.status === 'coming_soon') return { state: 'coming_soon', label: CONFIG.copy.badges.comingSoon };
    if (studioId === 'estimate') {
      if (activePlan === 'free') return { state: 'available', label: CONFIG.copy.badges.lite, lite: true };
      return { state: 'available', label: CONFIG.copy.badges.owned, lite: false };
    }
    if (can(studio.permission, activePlan)) return { state: 'available', label: CONFIG.copy.badges.owned };
    if (studioId === 'proposal') return { state: 'purchase', label: CONFIG.copy.badges.purchase };
    return { state: 'purchase', label: CONFIG.copy.badges.purchase };
  }

  global.DEFINED = Object.freeze({ config: CONFIG, normalizePlan, getPlanId, setPlan, plan, can, studioState });
})(window);
