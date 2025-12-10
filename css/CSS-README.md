# CSS Architecture - Telecall Website

## 📚 Overview

Este projeto utiliza uma **arquitetura CSS modular**

## 📁 Estrutura de Arquivos

### Core Stylesheets (Núcleo)

```
css/
├── style.css              ← Índice principal + documentação
├── variables.css          ← Design tokens (cores, espaçamento, etc)
├── reset.css              ← Reset global e estilos base
├── components.css         ← Componentes reutilizáveis
├── responsive.css         ← Media queries centralizadas
```

### Page-Specific Stylesheets (Páginas)

```
├── sections.css           ← Página inicial (home)
├── services.css           ← Seções de serviços
├── examples.css           ← Seção de exemplos
├── advantages.css         ← Seção de vantagens
├── forms.css              ← Formulários
├── footer.css             ← Rodapé
│
├── sms.css                ← Página SMS (refatorada)
├── login.css                ← Página Login (a refatorar)
├── cadastro.css           ← Página Cadastro (a refatorar)
├── 2fa.css                ← Página 2FA (a refatorar)
├── google.css             ← Página Google Auth (a refatorar)
├── numeromascara.css      ← Página Telefone (a refatorar)
├── redefinir.css          ← Página Redefinir Senha (a refatorar)
│
└── page-template.css      ← Template para novas páginas
```

## 🎨 Design Tokens (variables.css)

### Cores

```css
--color-primary:       #3477a7        /* Azul principal */
--color-primary-dark:  #0d4e7c        /* Azul escuro */
--color-primary-light: #29abe2        /* Azul claro */
--color-secondary:     #cf2e2c        /* Vermelho */
--color-text:          #222222        /* Texto */
--color-text-inverse:  #ffffff        /* Texto invertido */
--color-border:        #29abe2        /* Bordas */
--color-bg:            #ffffff        /* Fundo claro */
--color-bg-dark:       #222222        /* Fundo escuro */
```

### Espaçamento (escala 8px)

```css
--spacing-xs:   5px      /* Extra pequeno */
--spacing-sm:   10px     /* Pequeno */
--spacing-md:   20px     /* Médio (padrão) */
--spacing-lg:   30px     /* Grande */
--spacing-xl:   40px     /* Extra grande */
--spacing-2xl:  50px
--spacing-3xl:  70px
--spacing-4xl:  80px
--spacing-5xl:  100px
```

### Border Radius

```css
--radius-sm:   8px      /* Botões pequenos */
--radius-md:   15px     /* Padrão */
--radius-lg:   30px     /* Cards, containers */
--radius-xl:   35px     /* Elementos grandes */
--radius-2xl:  40px     /* Elementos extra grandes */
```

### Shadows

```css
--shadow-sm:  0px 1px 4px rgba(0, 0, 0, 0.2)      /* Sutil */
--shadow-md:  0px 2px 4px rgba(0, 0, 0, 0.2)      /* Padrão */
--shadow-lg:  3px 3px 10px #333                   /* Destaque */
```

### Gradientes

```css
--gradient-primary:           linear-gradient(180deg, #29abe2 0%, #0a6288 100%)
--gradient-dark:              linear-gradient(180deg, #313131e5 0%, #000000 100%)
--gradient-dark-transparent:  linear-gradient(180deg, #1a1a1a7a 0%, #00000074 100%)
```

## 🏗️ BEM Methodology

Padrão de nomenclatura para evitar conflitos:

```css
.block { }                          /* Componente principal */
.block__element { }                 /* Filho do componente */
.block--modifier { }                /* Variante do componente */
.block__element--modifier { }       /* Variante do filho */
```

### Exemplos

```css
/* Navegação */
.menu { }
.menu__nav { }
.menu__nav-link { }
.menu__nav-link:hover { }

/* Buttons */
.form__button { }
.form__button:hover { }
.form__button:disabled { }

/* Cards */
.service { }
.service__image { }
.service__title { }
.service__description { }
```

## 🌙 Dark Mode

Implementado automaticamente via CSS variables:

```html
<!-- HTML -->
<body class="darkmode">
  <!-- Conteúdo -->
</body>
```

No CSS, as variáveis mudam automaticamente:

```css
/* Light Mode (padrão) */
:root {
  --color-bg: #ffffff;
  --color-text: #222222;
}

/* Dark Mode */
body.darkmode {
  --color-bg: #222222;
  --color-text: #ffffff;
}
```

## 📱 Responsive Design

### Breakpoints

```css
@media (max-width: 480px)   { } /* Telefones pequenos */
@media (max-width: 580px)   { } /* Telefones */
@media (max-width: 820px)   { } /* Tablets pequenos */
@media (max-width: 1120px)  { } /* Desktops pequenos */
@media (max-width: 1300px)  { } /* Todos */
```

## 🎯 Como Refatorar uma Página Existente

### 1. Estrutura HTML

```html
<!-- Antes -->
<style>
  .menu-bg { background: linear-gradient(...); }
  .menu { ... }
  /* Muitas linhas duplicadas */
</style>

<!-- Depois -->
<!-- Importar o CSS na página -->
<link rel="stylesheet" href="css/style.css">        <!-- Home -->
<link rel="stylesheet" href="css/sms.css">          <!-- SMS -->
```

### 2. Criar o arquivo CSS da página

Use o template `page-template.css` como base:

```css
@import url('./variables.css');
@import url('./reset.css');
@import url('./components.css');

/* Estilos específicos da página */
.page-hero { ... }
.page-content { ... }
```

### 3. Usar variáveis em vez de cores

```css
/* ❌ Errado */
.my-button {
  background-color: #29abe2;
  padding: 20px;
  margin: 30px;
}

/* ✅ Correto */
.my-button {
  background-color: var(--color-primary-light);
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
}
```

### 4. Seguir BEM para nomes de classes

```css
/* ❌ Errado */
.sms-title { }
.sms-title-color { }
.sms-title-font { }

/* ✅ Correto */
.sms__heading { }
.sms__heading::after { }
.sms__accent { }
```

### 5. Consolidar media queries no fim do arquivo

```css
/* Estilos principais */
.my-section { ... }
.my-section__content { ... }

/* Media queries no fim */
@media (max-width: 1200px) { ... }
@media (max-width: 820px) { ... }
@media (max-width: 480px) { ... }
```

## ✅ Checklist de Refatoração

- [ ] Remover variáveis CSS duplicadas
- [ ] Importar `variables.css`, `reset.css`, `components.css`
- [ ] Renomear classes para BEM
- [ ] Substituir cores hardcoded por variáveis
- [ ] Substituir pixels por variáveis de espaçamento
- [ ] Consolidar media queries no fim
- [ ] Testar light mode e dark mode
- [ ] Testar responsividade em 480px, 820px, 1200px
- [ ] Remover código CSS duplicado


## 💡 Tips

1. **Sempre use variáveis** - Mais fácil manter e atualizar
2. **Mobile-first** - Estilos base para mobile, depois adicione para desktop
3. **Teste dark mode** - Adicione `class="darkmode"` ao `<body>` para testar
4. **Reutilize componentes** - Use classes de `components.css`
5. **Documente classes** - Comente classes complexas com propósito
