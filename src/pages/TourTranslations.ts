export type Language = 'en' | 'pt' | 'fr';

export const TRANSLATIONS = {
  en: {
    back: "Services",
    hero: {
      label: "Kings 'n Company · Property Ownership Tour",
      eyebrow: "Portugal · July 2025",
      h1_1: "Own",
      h1_2: "Portugal.",
      h1_3: "Start Here.",
      date: "6 – 10 July · Lisbon, Portugal",
      cta_reserve: "RESERVE MY SPOT — 3,500€",
      cta_private: "Book Private Tour",
      scroll: "Scroll"
    },
    intro: "An immersive five-day experience designed to take you from curiosity to confidence — and from renter to owner.",
    about: {
      label: "The Experience",
      heading_1: "Portugal is ",
      heading_2: "calling",
      heading_3: " — and we answer together.",
      body_1: "The Kings 'n Company Property Ownership Tour is the only group experience of its kind designed specifically for the African and African-American diaspora investor. Over five days, you will walk through some of Lisbon's most sought-after properties, sit at the table with legal and financial experts, and walk away with the clarity, confidence, and relationships you need to move forward.",
      body_2: "This is not a sightseeing trip. Every hour is structured for a single outcome: making you a Portuguese property owner — this year.",
      stats: [
        { num: "5", label: "Days of Immersion" },
        { num: "6", label: "Spots Available" },
        { num: "1:1", label: "Free Consultation" },
        { num: "∞", label: "Doors Opened" }
      ],
      who_label: "Who It's For",
      who_heading_1: "You've thought about this enough. ",
      who_heading_2: "The time has come.",
      who_body: "This tour is for diaspora members — based in the US, UK, or elsewhere — who are serious about buying property in Portugal.",
      audience: [
        "Relocating or planning to move to Portugal",
        "Building a real estate investment portfolio in Europe",
        "Looking for passive income through rentals",
        "Exploring residency or NHR pathways in Portugal",
        "Looking for your first property abroad"
      ],
      quote: "We did not build Kings 'n Company to sell you a property. We built it to guide you home.",
      founder: "Ismael Gomes Queta · Founder, Kings 'n Company"
    },
    itinerary: {
      label: "Day by Day",
      heading_1: "Five days. ",
      heading_2: "One transformation.",
      subtitle: "From arrival to action — every session is designed to move you forward.",
      days: [
        {
          day: "01", date: "Sunday · 6 July", title: "Arrival & Orientation",
          items: ["Welcome reception & group dinner (included meal)", "KnC programme overview & goals session", "Portugal market briefing: current landscape & opportunities", "1:1 personal goals conversation with your consultant", "City orientation & logistics overview"]
        },
        {
          day: "02", date: "Monday · 7 July", title: "Legal & Financial Framework",
          items: ["Morning: Property law masterclass with specialist lawyer", "NIF registration, CPCV, and deed process explained", "Tax session with Portuguese accountant (IRS, NHR, IMT)", "Afternoon: Mortgage & financing structures with broker", "Evening: Q&A roundtable — bring every question"]
        },
        {
          day: "03", date: "Tuesday · 8 July", title: "Property Typology & Analysis",
          items: ["Introduction to Portuguese property types: T0 to T4+, commercial, land", "New build vs. resale vs. renovation — pros & cons", "Investment analysis workshop: yield calculation, cash flow, ROI", "Rental income vs. capital appreciation strategies", "Group deal simulation exercise with real data"]
        },
        {
          day: "04", date: "Wednesday · 9 July", title: "Live Property Tours",
          items: ["Curated tours across 4–6 pre-selected properties", "Mix of Lisbon neighbourhoods: central, emerging, coastal", "On-site analysis with your consultant — what to look for", "Developer and agent meetings included", "Post-tour debrief: ranking and shortlisting"]
        },
        {
          day: "05", date: "Thursday · 10 July", title: "Strategy & Next Steps",
          items: ["Personal 1:1 strategy consultation (free, included)", "Custom property roadmap for each participant", "Network introductions: legal, financial, and property contacts", "How to proceed remotely from your home country", "Closing session & group farewell lunch"]
        }
      ]
    },
    inclusions: {
      label: "What's Included",
      heading_1: "Everything you need. ",
      heading_2: "Nothing you don't.",
      items: [
        { icon: "🏨", title: "4-Night Hotel Stay", description: "Accommodation for the full duration of the programme, centrally located in Lisbon." },
        { icon: "🍽️", title: "One Meal Per Day", description: "A daily group meal included — spanning welcome dinner, working lunches, and farewell lunch." },
        { icon: "🏛️", title: "Lawyer & Accountant Sessions", description: "Direct access to specialist legal and tax professionals briefed on diaspora investor needs." },
        { icon: "🏦", title: "Mortgage Broker Meeting", description: "Private session with a mortgage broker experienced in financing for non-resident buyers." },
        { icon: "🔑", title: "Live Property Tours", description: "Curated visits to 4–6 real properties across different Lisbon neighbourhoods and price points." },
        { icon: "📊", title: "Investment Analysis Workshop", description: "Hands-on session to analyse real deals, calculate yields, and understand what makes a good investment." },
        { icon: "💬", title: "Free 1:1 Consultation", description: "A private strategy session with your Kings 'n Company consultant — included, no upsell." },
        { icon: "📁", title: "KnC Resource Pack", description: "Digital materials: property checklists, investment templates, key contacts, and your personal roadmap." }
      ],
      not_included: {
        title: "Not Included",
        text: "Flights to and from Lisbon. Travel insurance. Personal meals beyond the daily group meal. Property purchase costs, legal fees, or taxes incurred during or after the programme."
      }
    },
    pricing: {
      label: "Investment",
      heading_1: "One price. ",
      heading_2: "Total clarity.",
      body: "No hidden fees. No surprises. Everything listed above is included.",
      badge: "⚡ Max. 6 Spots — First Edition",
      tier: "Group Tour · Per Person",
      amount: "3,500",
      currency: "€",
      note: "All-inclusive: hotel, meals, sessions, tours and consultancy",
      features: [
        { text: "4-night hotel accommodation in central Lisbon", highlight: true },
        { text: "One group meal per day throughout the programme" },
        { text: "Lawyer, accountant & mortgage broker sessions" },
        { text: "Live property tours across Lisbon" },
        { text: "Property typology & investment analysis workshop" },
        { text: "Free 1:1 personal strategy consultation", highlight: true },
        { text: "KnC resource pack & personal property roadmap" },
        { text: "Kings 'n Company aftercare & continued support" }
      ],
      cta: "RESERVE MY SPOT — 3,500€",
      deposit_note: "A deposit of 1,000€ secures your place. Balance due by 1 June 2025."
    },
    private: {
      label: "Prefer Something Custom?",
      heading_1: "Private tours available ",
      heading_2: "upon request.",
      body: "Not every investor wants a group experience. If you prefer a fully private and personalized property tour — on your time, at your pace, and focused entirely on your investment goals — we offer bespoke private tours throughout the year.",
      cta: "Request a Private Tour"
    },
    tc: {
      label: "Terms & Conditions",
      heading_1: "Full ",
      heading_2: "transparency.",
      body: "Please read the following before booking your spot. By completing payment, you agree to these terms.",
      contact: "For questions about the programme, inclusions or these terms, contact us at ",
      contact_cta: "before booking. We are available to answer all questions.",
      blocks: [
        {
          title: "Booking & Payment",
          items: ["A non-refundable deposit of 1,000€ is required to secure your place. The remaining balance of 2,500€ is due by 1 June 2025.", "Full payment is accepted via bank transfer. Payment details are provided upon booking confirmation.", "Your place is only confirmed upon receipt of the deposit and written confirmation from Kings 'n Company.", "Maximum group size is 6 participants. Places are allocated on a first-paid basis."]
        },
        {
          title: "Cancellation Policy",
          items: ["The 1,000€ deposit is non-refundable under all circumstances.", "Cancellations received before 1 June 2025: balance refunded in full.", "Cancellations received between 1 June and 22 June 2025: 50% of the balance will be refunded.", "Cancellations received after 22 June 2025: no refund. Your place may be transferred to another person — notify us in writing at least 5 days prior.", "Kings 'n Company reserves the right to cancel the tour if fewer than 3 participants are confirmed by 1 June 2025, in which case all payments including the deposit will be refunded in full."]
        },
        {
          title: "Programme & Inclusions",
          items: ["The programme itinerary is subject to change. Kings 'n Company reserves the right to adjust session content, property visit schedules, or professional speakers while maintaining the overall value and objectives of the tour.", "Hotel accommodation is provided for 4 nights (6–9 July). Check-out is on 10 July. Participants are responsible for arranging their own travel to and from Lisbon.", "One meal per day is included as part of the group programme. Additional meals, drinks, and personal expenses are not covered.", "The free 1:1 consultation is a strategic guidance session. It does not constitute legal, financial, tax, or investment advice.", "Professional sessions (lawyer, accountant, mortgage broker) are educational in nature. They do not form a client–professional relationship unless separately contracted by the participant."]
        },
        {
          title: "Liability & Conduct",
          items: ["Kings 'n Company accepts no responsibility for any loss, injury, property damage, or travel disruption arising before, during, or after the programme. Participants are strongly advised to obtain comprehensive travel insurance.", "Property tours are conducted with the cooperation of third-party agents and developers. Kings 'n Company does not guarantee the availability of specific properties.", "Kings 'n Company does not act as a buyer's agent or legal representative during the tour. Any property transactions entered into are the sole decision and responsibility of the participant.", "Kings 'n Company reserves the right to remove any participant from the programme for disruptive or inappropriate conduct without refund.", "By participating, you consent to photography and video recording during the programme for use in Kings 'n Company marketing materials. Opt-out requests must be submitted in writing before the programme begins."]
        }
      ]
    },
    footer: {
      tagline: "Property Ownership · Portugal & West Africa",
      links: ["Book Spot", "Private Tours", "Contact"],
      copy: "© 2025 Kings 'n Company · Lisbon, Portugal. Property Ownership Tour is operated by Kings 'n Company. All rights reserved."
    }
  },
  pt: {
    back: "Serviços",
    hero: {
      label: "Kings 'n Company · Property Ownership Tour",
      eyebrow: "Portugal · Julho 2025",
      h1_1: "Own",
      h1_2: "Portugal.",
      h1_3: "Comece Aqui.",
      date: "6 – 10 Julho · Lisboa, Portugal",
      cta_reserve: "RESERVAR O MEU LUGAR — 3.500€",
      cta_private: "Reservar Tour Privado",
      scroll: "Scroll"
    },
    intro: "Uma experiência imersiva de cinco dias desenhada para te levar da curiosidade à confiança — e de arrendatário a proprietário.",
    about: {
      label: "A Experiência",
      heading_1: "Portugal está a ",
      heading_2: "chamar",
      heading_3: " — e respondemos juntos.",
      body_1: "O Property Ownership Tour da Kings 'n Company é a única experiência de grupo do género concebida especificamente para o investidor da diáspora africana e afro-americana. Em cinco dias, percorrerá algumas das propriedades mais procuradas de Lisboa, sentará à mesa com especialistas jurídicos e financeiros, e sairá com a clareza, a confiança e as relações de que precisa para avançar.",
      body_2: "Isto não é uma viagem turística. Cada hora está estruturada para um único resultado: torná-lo proprietário de um imóvel português — este ano.",
      stats: [
        { num: "5", label: "Dias de Imersão" },
        { num: "6", label: "Lugares Disponíveis" },
        { num: "1:1", label: "Consultoria Gratuita" },
        { num: "∞", label: "Portas Abertas" }
      ],
      who_label: "Para Quem É",
      who_heading_1: "Já pensou nisto vezes suficientes. ",
      who_heading_2: "Chegou a hora.",
      who_body: "Este tour destina-se a membros da diáspora — sediados nos EUA, no Reino Unido ou noutros países — que estão sérios quanto à compra de imóveis em Portugal.",
      audience: [
        "A realojar-se ou a planear mudar-se para Portugal",
        "A construir uma carteira de investimento imobiliário na Europa",
        "À procura de rendimento passivo através de arrendamento",
        "A explorar as vias de residência ou NHR em Portugal",
        "À procura do seu primeiro imóvel no estrangeiro"
      ],
      quote: "Não construímos a Kings 'n Company para lhe vender uma propriedade. Construímo-la para o guiar até casa.",
      founder: "Ismael Gomes Queta · Fundador, Kings 'n Company"
    },
    itinerary: {
      label: "Dia a Dia",
      heading_1: "Cinco dias. ",
      heading_2: "Uma transformação.",
      subtitle: "Da chegada à ação — cada sessão está desenhada para o fazer avançar.",
      days: [
        {
          day: "01", date: "Domingo · 6 Julho", title: "Chegada & Orientação",
          items: ["Receção de boas-vindas & jantar de grupo (refeição incluída)", "Visão geral do programa KnC & sessão de objetivos", "Briefing do mercado de Portugal: cenário atual & oportunidades", "Conversa pessoal 1:1 sobre objetivos com o seu consultor", "Orientação da cidade & visão geral logística"]
        },
        {
          day: "02", date: "Segunda · 7 Julho", title: "O Quadro Jurídico & Financeiro",
          items: ["Manhã: Masterclass de direito imobiliário com advogado especialista", "Registo de NIF, CPCV e processo de escritura explicados", "Sessão fiscal com contabilista português (IRS, NHR, IMT)", "Tarde: Estruturas de crédito habitação & financiamento com broker", "Noite: Mesa redonda de perguntas & respostas — traga todas as questões"]
        },
        {
          day: "03", date: "Terça · 8 Julho", title: "Tipologia & Análise de Propriedades",
          items: ["Introdução aos tipos de propriedades portuguesas: T0 a T4+, comercial, terrenos", "Construção nova vs. revenda vs. renovação — prós & contras", "Workshop de análise de investimento: cálculo de yield, cash flow, ROI", "Rendimento de arrendamento vs. estratégias de valorização de capital", "Exercício de simulação de negócio em grupo com dados reais"]
        },
        {
          day: "04", date: "Quarta · 9 Julho", title: "Tours de Propriedades ao Vivo",
          items: ["Tours curados em 4–6 propriedades pré-selecionadas", "Mistura de bairros de Lisboa: central, emergente, costeiro", "Análise no local com o seu consultor — o que procurar", "Reuniões com promotores e agentes incluídas", "Debrief pós-tour: ranking e seleção final"]
        },
        {
          day: "05", date: "Quinta · 10 Julho", title: "Estratégia & Próximos Passos",
          items: ["Consultoria estratégica pessoal 1:1 (gratuita, incluída)", "Roteiro de propriedade personalizado para cada participante", "Introduções de rede: contactos jurídicos, financeiros e imobiliários", "Como proceder remotamente a partir do seu país de origem", "Sessão de encerramento & almoço de despedida de grupo"]
        }
      ]
    },
    inclusions: {
      label: "O Que Está Incluído",
      heading_1: "Tudo o que precisa. ",
      heading_2: "Nada do que não precisa.",
      items: [
        { icon: "🏨", title: "Estadia de 4 Noites em Hotel", description: "Alojamento durante toda a duração do programa, localizado centralmente em Lisboa." },
        { icon: "🍽️", title: "Uma Refeição por Dia", description: "Uma refeição diária de grupo incluída — abrangendo jantar de boas-vindas, almoços de trabalho e almoço de despedida." },
        { icon: "🏛️", title: "Sessões com Advogado e Contabilista", description: "Acesso direto a profissionais jurídicos e fiscais especialistas, informados sobre as necessidades dos investidores da diáspora." },
        { icon: "🏦", title: "Reunião com Broker de Crédito", description: "Sessão privada com um broker de crédito experiente em financiamento para compradores não residentes." },
        { icon: "🔑", title: "Tours de Propriedades ao Vivo", description: "Visitas curadas a 4–6 propriedades reais em diferentes bairros de Lisboa e pontos de preço." },
        { icon: "📊", title: "Workshop de Análise de Investimento", description: "Sessão prática para analisar negócios reais, calcular yields e entender o que torna um investimento bom." },
        { icon: "💬", title: "Consultoria Gratuita 1:1", description: "Uma sessão de estratégia privada com o seu consultor da Kings 'n Company — incluída, sem upsell." },
        { icon: "📁", title: "Pack de Recursos KnC", description: "Materiais digitais: checklists de propriedades, templates de investimento, contactos chave e o seu roteiro pessoal." }
      ],
      not_included: {
        title: "Não Incluído",
        text: "Voos de e para Lisboa. Seguro de viagem. Refeições pessoais além da refeição diária de grupo incluída. Custos de compra de propriedade, taxas legais ou impostos incorridos durante ou após o programa."
      }
    },
    pricing: {
      label: "Investimento",
      heading_1: "Um preço. ",
      heading_2: "Clareza total.",
      body: "Sem taxas ocultas. Sem surpresas. Tudo o que está listado acima está incluído.",
      badge: "⚡ Máx. 6 Lugares — Primeira Edição",
      tier: "Tour em Grupo · Por Pessoa",
      amount: "3.500",
      currency: "€",
      note: "All-inclusive: hotel, refeições, sessões, tours e consultoria",
      features: [
        { text: "Alojamento de 4 noites em hotel no centro de Lisboa", highlight: true },
        { text: "Uma refeição de grupo por dia durante o programa" },
        { text: "Sessões com advogado, contabilista & broker de crédito" },
        { text: "Tours de propriedades ao vivo em Lisboa" },
        { text: "Workshop de tipologia de propriedade & análise de investimento" },
        { text: "Consultoria estratégica pessoal 1:1 gratuita", highlight: true },
        { text: "Pack de recursos KnC & roteiro pessoal de propriedade" },
        { text: "Aftercare & apoio contínuo da Kings 'n Company" }
      ],
      cta: "RESERVAR O MEU LUGAR — 3.500€",
      deposit_note: "Um depósito de 1.000€ garante o seu lugar. Saldo devedor até 1 de Junho de 2025."
    },
    private: {
      label: "Prefere Algo Personalizado?",
      heading_1: "Tours privados disponíveis ",
      heading_2: "mediante pedido.",
      body: "Nem todos os investidores querem uma experiência de grupo. Se preferir um tour imobiliário totalmente privado e personalizado — no seu tempo, ao seu ritmo, e focado inteiramente nos seus objetivos de investimento — oferecemos tours privados à medida ao longo do ano.",
      cta: "Solicitar um Tour Privado"
    },
    tc: {
      label: "Termos & Condições",
      heading_1: "Transparência ",
      heading_2: "total.",
      body: "Por favor, leia o seguinte antes de reservar o seu lugar. Ao concluir o pagamento, concorda com estes termos.",
      contact: "Para questões sobre o programa, inclusões ou estes termos, contacte-nos em ",
      contact_cta: "antes de reservar. Estamos disponíveis para responder a todas as questões.",
      blocks: [
        {
          title: "Reserva & Pagamento",
          items: ["Um depósito não reembolsável de 1.000€ é necessário para garantir o seu lugar. O saldo restante de 2.500€ deve ser pago até 1 de Junho de 2025.", "O pagamento total é aceite via transferência bancária. Os detalhes do pagamento são fornecidos após a confirmação da reserva.", "O seu lugar só é confirmado após a receção do depósito e confirmação por escrito da Kings 'n Company.", "O tamanho máximo do grupo é de 6 participantes. Os lugares são alocados por ordem de pagamento."]
        },
        {
          title: "Política de Cancelamento",
          items: ["O depósito de 1.000€ não é reembolsável em nenhuma circunstância.", "Cancelamentos recebidos antes de 1 de Junho de 2025: saldo reembolsado na totalidade.", "Cancelamentos recebidos entre 1 de Junho e 22 de Junho de 2025: 50% do saldo será reembolsado.", "Cancelamentos recebidos após 22 de Junho de 2025: sem reembolso. O seu lugar pode ser transferido para outra pessoa — notifique-nos por escrito com pelo menos 5 dias de antecedência.", "A Kings 'n Company reserva-se o direito de cancelar o tour se menos de 3 participantes forem confirmados até 1 de Junho de 2025, caso em que todos os pagamentos, incluindo o depósito, serão reembolsados na totalidade."]
        },
        {
          title: "Programa & Inclusões",
          items: ["O itinerário do programa está sujeito a alterações. A Kings 'n Company reserva-se o direito de ajustar o conteúdo das sessões, os horários das visitas às propriedades ou os oradores profissionais, mantendo o valor e os objetivos gerais do tour.", "O alojamento em hotel é fornecido por 4 noites (6–9 de Julho). O check-out é a 10 de Julho. Os participantes são responsáveis por organizar a sua própria viagem de e para Lisboa.", "Uma refeição por dia está incluída como parte do programa de grupo. Refeições adicionais, bebidas e despesas pessoais não estão cobertas.", "A consultoria gratuita 1:1 é uma sessão de orientação estratégica. Não constitui aconselhamento jurídico, financeiro, fiscal ou de investimento.", "As sessões profissionais (advogado, contabilista, broker de crédito) são de natureza educacional. Não formam uma relação cliente-profissional, a menos que sejam contratadas separadamente pelo participante."]
        },
        {
          title: "Responsabilidade & Conduta",
          items: ["A Kings 'n Company não aceita qualquer responsabilidade por qualquer perda, lesão, dano de propriedade ou interrupção de viagem decorrente antes, durante ou após o programa. Os participantes são fortemente aconselhados a obter um seguro de viagem abrangente.", "Os tours de propriedades são realizados com a cooperação de agentes e promotores terceiros. A Kings 'n Company não garante a disponibilidade de propriedades específicas.", "A Kings 'n Company não atua como agente de comprador ou representante legal durante o tour. Quaisquer transações imobiliárias celebradas são de inteira decisão e responsabilidade do participante.", "A Kings 'n Company reserva-se o direito de remover qualquer participante do programa por conduta disruptiva ou inapropriada sem reembolso.", "Ao participar, consente na fotografia e gravação de vídeo durante o programa para uso em materiais de marketing da Kings 'n Company. Os pedidos de exclusão devem ser enviados por escrito antes do início do programa."]
        }
      ]
    },
    footer: {
      tagline: "Propriedade Imobiliária · Portugal & África Ocidental",
      links: ["Reservar Lugar", "Tours Privados", "Contacto"],
      copy: "© 2025 Kings 'n Company · Lisboa, Portugal. Property Ownership Tour é operado pela Kings 'n Company. Todos os direitos reservados."
    }
  },
  fr: {
    back: "Services",
    hero: {
      label: "Kings 'n Company · Property Ownership Tour",
      eyebrow: "Portugal · Juillet 2025",
      h1_1: "Own",
      h1_2: "Portugal.",
      h1_3: "Commencez Ici.",
      date: "6 – 10 Juillet · Lisbonne, Portugal",
      cta_reserve: "RÉSERVER MA PLACE — 3.500€",
      cta_private: "Réserver un Tour Privé",
      scroll: "Défiler"
    },
    intro: "Une expérience immersive de cinq jours conçue pour vous faire passer de la curiosité à la confiance — et de locataire à propriétaire.",
    about: {
      label: "L'Expérience",
      heading_1: "Le Portugal vous ",
      heading_2: "appelle",
      heading_3: " — et nous répondons ensemble.",
      body_1: "Le Property Ownership Tour de Kings 'n Company est la seule expérience de groupe de ce type conçue spécifiquement pour l'investisseur de la diaspora africaine et afro-américaine. Pendant cinq jours, vous parcourrez certaines des propriétés les plus recherchées de Lisbonne, vous vous assiérez à la table avec des experts juridiques et financiers, et vous repartirez avec la clarté, la confiance et les relations dont vous avez besoin pour avancer.",
      body_2: "Il ne s'agit pas d'un voyage touristique. Chaque heure est structurée pour un seul résultat : faire de vous un propriétaire immobilier au Portugal — cette année.",
      stats: [
        { num: "5", label: "Jours d'Immersion" },
        { num: "6", label: "Places Disponibles" },
        { num: "1:1", label: "Consultation Gratuite" },
        { num: "∞", label: "Portes Ouvertes" }
      ],
      who_label: "Pour Qui",
      who_heading_1: "Vous y avez assez pensé. ",
      who_heading_2: "Le moment est venu.",
      who_body: "Ce tour s'adresse aux membres de la diaspora — basés aux États-Unis, au Royaume-Uni ou ailleurs — qui sont sérieux au sujet de l'achat d'une propriété au Portugal.",
      audience: [
        "Réinstallation ou projet de déménagement au Portugal",
        "Constitution d'un portefeuille d'investissement immobilier en Europe",
        "Recherche de revenus passifs par la location",
        "Exploration des voies de résidence ou du NHR au Portugal",
        "Recherche de votre première propriété à l'étranger"
      ],
      quote: "Nous n'avons pas construit Kings 'n Company pour vous vendre une propriété. Nous l'avons construite pour vous guider jusqu'à la maison.",
      founder: "Ismael Gomes Queta · Fondateur, Kings 'n Company"
    },
    itinerary: {
      label: "Jour par Jour",
      heading_1: "Cinq jours. ",
      heading_2: "Une transformation.",
      subtitle: "De l'arrivée à l'action — chaque session est conçue pour vous faire progresser.",
      days: [
        {
          day: "01", date: "Dimanche · 6 Juillet", title: "Arrivée & Orientation",
          items: ["Réception de bienvenue & dîner de groupe (repas inclus)", "Présentation du programme KnC & session sur les objectifs", "Briefing sur le marché du Portugal : paysage actuel & opportunités", "Entretien personnel 1:1 sur les objectifs avec votre consultant", "Orientation de la ville & vue d'ensemble logistique"]
        },
        {
          day: "02", date: "Lundi · 7 Juillet", title: "Le Cadre Juridique & Financier",
          items: ["Matin : Masterclass de droit immobilier avec un avocat spécialisé", "Enregistrement du NIF, CPCV et processus d'acte expliqués", "Session fiscale avec un comptable portugais (IRS, NHR, IMT)", "Après-midi : Structures de prêt immobilier & financement avec un courtier", "Soirée : Table ronde Q&A — apportez toutes vos questions"]
        },
        {
          day: "03", date: "Mardi · 8 Juillet", title: "Typologie & Analyse des Propriétés",
          items: ["Introduction aux types de propriétés portugaises : T0 à T4+, commercial, terrains", "Neuf vs. revente vs. rénovation — avantages & inconvénients", "Atelier d'analyse d'investissement : calcul de rendement, cash-flow, ROI", "Revenu locatif vs. stratégies d'appréciation du capital", "Exercice de simulation de transaction en groupe avec des données réelles"]
        },
        {
          day: "04", date: "Mercredi · 9 Juillet", title: "Visites de Propriétés en Direct",
          items: ["Visites guidées à travers 4–6 propriétés présélectionnées", "Mélange de quartiers de Lisbonne : central, émergent, côtier", "Analyse sur site avec votre consultant — ce qu'il faut chercher", "Réunions avec des promoteurs et des agents incluses", "Débriefing post-visite : classement et sélection finale"]
        },
        {
          day: "05", date: "Jeudi · 10 Juillet", title: "Stratégie & Prochaines Étapes",
          items: ["Consultation stratégique personnelle 1:1 (gratuite, incluse)", "Feuille de route immobilière personnalisée pour chaque participant", "Introductions de réseau : contacts juridiques, financiers et immobiliers", "Comment procéder à distance depuis votre pays d'origine", "Session de clôture & déjeuner de groupe d'adieu"]
        }
      ]
    },
    inclusions: {
      label: "Ce Qui Est Inclus",
      heading_1: "Tout ce dont vous avez besoin. ",
      heading_2: "Rien de superflu.",
      items: [
        { icon: "🏨", title: "Séjour de 4 Nuits à l'Hôtel", description: "Hébergement pour toute la durée du programme, situé au centre de Lisbonne." },
        { icon: "🍽️", title: "Un Repas par Jour", description: "Un repas de groupe quotidien inclus — comprenant le dîner de bienvenue, les déjeuners de travail et le déjeuner d'adieu." },
        { icon: "🏛️", title: "Sessions Avocat & Comptable", description: "Accès direct à des professionnels juridiques et fiscaux spécialisés, informés des besoins des investisseurs de la diaspora." },
        { icon: "🏦", title: "Réunion Courtier Immobilier", description: "Session privée avec un courtier en prêts immobiliers expérimenté dans le financement pour les non-résidents." },
        { icon: "🔑", title: "Visites de Propriétés en Direct", description: "Visites guidées de 4–6 propriétés réelles dans différents quartiers de Lisbonne et points de prix." },
        { icon: "📊", title: "Atelier d'Analyse d'Investissement", description: "Session pratique pour analyser des transactions réelles, calculer les rendements et comprendre ce qui fait un bon investissement." },
        { icon: "💬", title: "Consultation Gratuite 1:1", description: "Une session stratégique privée avec votre consultant Kings 'n Company — incluse, pas de vente additionnelle." },
        { icon: "📁", title: "Pack de Ressources KnC", description: "Supports numériques : checklists de propriétés, modèles d'investissement, contacts clés et votre feuille de route personnelle." }
      ],
      not_included: {
        title: "Non Inclus",
        text: "Vols de et vers Lisbonne. Assurance voyage. Repas personnels au-delà du repas de groupe quotidien inclus. Frais d'achat immobilier, frais juridiques ou taxes encourus pendant ou après le programme."
      }
    },
    pricing: {
      label: "Investissement",
      heading_1: "Un prix. ",
      heading_2: "Clarté totale.",
      body: "Pas de frais cachés. Pas de surprises. Tout ce qui est listé ci-dessus est inclus.",
      badge: "⚡ Max. 6 Places — Première Édition",
      tier: "Tour en Groupe · Par Personne",
      amount: "3.500",
      currency: "€",
      note: "Tout inclus : hôtel, repas, sessions, visites et conseil",
      features: [
        { text: "Hébergement de 4 nuits à l'hôtel au centre de Lisbonne", highlight: true },
        { text: "Un repas de groupe par jour tout au long du programme" },
        { text: "Sessions avocat, comptable & courtier en prêts immobiliers" },
        { text: "Visites de propriétés en direct à travers Lisbonne" },
        { text: "Typologie immobilière & atelier d'analyse d'investissement" },
        { text: "Consultation stratégique personnelle 1:1 gratuite", highlight: true },
        { text: "Pack de ressources KnC & feuille de route immobilière personnelle" },
        { text: "Suivi & assistance continue de Kings 'n Company" }
      ],
      cta: "RÉSERVER MA PLACE — 3.500€",
      deposit_note: "Un acompte de 1.000€ garantit votre place. Solde dû avant le 1er juin 2025."
    },
    private: {
      label: "Vous Préférez Quelque Chose sur Mesure ?",
      heading_1: "Tours privés disponibles ",
      heading_2: "sur demande.",
      body: "Tous les investisseurs ne souhaitent pas une expérience de groupe. Si vous préférez une visite immobilière entièrement privée et personnalisée — à votre moment, à votre rythme, et entièrement axée sur vos objectifs d'investissement — nous proposons des visites privées sur mesure tout au long de l'année.",
      cta: "Demander un Tour Privé"
    },
    tc: {
      label: "Termes & Conditions",
      heading_1: "Transparence ",
      heading_2: "totale.",
      body: "Veuillez lire ce qui suit avant de réserver votre place. En finalisant le paiement, vous acceptez ces conditions.",
      contact: "Pour toute question sur le programme, les inclusions ou ces conditions, contactez-nous à ",
      contact_cta: "avant de réserver. Nous sommes disponibles pour répondre à toutes vos questions.",
      blocks: [
        {
          title: "Réservation & Paiement",
          items: ["Un acompte non remboursable de 1.000€ est requis pour garantir votre place. Le solde restant de 2.500€ est dû avant le 1er juin 2025.", "Le paiement intégral est accepté par virement bancaire. Les détails de paiement sont fournis après confirmation de la réservation.", "Votre place n'est confirmée qu'à réception de l'acompte et d'une confirmation écrite de Kings 'n Company.", "La taille maximale du groupe est de 6 participants. Les places sont attribuées selon l'ordre des paiements reçus."]
        },
        {
          title: "Politique d'Annulation",
          items: ["L'acompte de 1.000€ est non remboursable en toutes circonstances.", "Annulations reçues avant le 1er juin 2025 : solde remboursé intégralement.", "Annulations reçues entre le 1er juin et le 22 juin 2025 : 50% du solde sera remboursé.", "Annulations reçues après le 22 juin 2025 : pas de remboursement. Votre place peut être transférée à une autre personne — informez-nous par écrit au moins 5 jours avant.", "Kings 'n Company se réserve le droit d'annuler le tour si moins de 3 participants sont confirmés d'ici le 1er juin 2025, auquel cas tous les paiements, y compris l'acompte, seront remboursés intégralement."]
        },
        {
          title: "Programme & Inclusions",
          items: ["L'itinéraire du programme est susceptible d'être modifié. Kings 'n Company se réserve le droit d'ajuster le contenu des sessions, les horaires des visites de propriétés ou les intervenants professionnels tout en maintenant la valeur globale et les objectifs du tour.", "L'hébergement à l'hôtel est prévu pour 4 nuits (6–9 juillet). Le départ se fait le 10 juillet. Les participants sont responsables de l'organisation de leur propre voyage vers et depuis Lisbonne.", "Un repas par jour est inclus dans le cadre du programme de groupe. Les repas supplémentaires, les boissons et les dépenses personnelles ne sont pas couverts.", "La consultation gratuite 1:1 est une session d'orientation stratégique. Elle ne constitue pas un conseil juridique, financier, fiscal ou d'investissement.", "Les sessions professionnelles (avocat, comptable, courtier en prêts immobiliers) sont de nature éducative. Elles ne constituent pas une relation client-professionnel, sauf contrat séparé par le participant."]
        },
        {
          title: "Responsabilité & Conduite",
          items: ["Kings 'n Company n'accepte aucune responsabilité pour toute perte, blessure, dommage matériel ou interruption de voyage survenant avant, pendant ou après le programme. Il est fortement conseillé aux participants de souscrire une assurance voyage complète.", "Les visites de propriétés sont effectuées avec la coopération d'agents et de promoteurs tiers. Kings 'n Company ne garantit pas la disponibilité de propriétés spécifiques.", "Kings 'n Company n'agit pas en tant qu'agent d'achat ou représentant légal pendant le tour. Toute transaction immobilière conclue relève de la seule décision et responsabilité du participant.", "Kings 'n Company se réserve le droit d'exclure tout participant du programme pour conduite perturbatrice ou inappropriée sans remboursement.", "En participant, vous consentez à la photographie et à l'enregistrement vidéo pendant le programme pour une utilisation dans les supports marketing de Kings 'n Company. Les demandes de retrait doivent être soumises par écrit avant le début du programme."]
        }
      ]
    },
    footer: {
      tagline: "Propriété Immobilière · Portugal & Afrique de l'Ouest",
      links: ["Réserver Place", "Tours Privés", "Contact"],
      copy: "© 2025 Kings 'n Company · Lisbonne, Portugal. Property Ownership Tour est opéré par Kings 'n Company. Tous droits réservés."
    }
  }
};
