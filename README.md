# My App Box

Um **catálogo de apps** com visual “cosmos” (canvas animado), **filtros por categoria**, **busca por nome** e um **rastro sutil do mouse**.
Na barra **“busca por app”**, além de filtrar os cards, ao pressionar **Enter** o texto é enviado para uma **busca no Google** em uma nova aba.

## Demo / Preview
- Fundo animado com estrelas/nebulosas (Canvas)
- Cards com glow/tilt + ripple
- Busca instantânea + filtros
- Mouse trail suave (com interpolação para não “quebrar” em movimentos rápidos)
- Enter na busca abre o Google com o termo digitado

## Funcionalidades

### Busca por app
- Digitar no campo filtra os cards em tempo real (por `data-name`)
- `Enter` abre:
- `https://www.google.com/search?q=<termo>`

### Filtros
- Botões de filtro alternam a categoria ativa (por `data-category`)
- Filtro + busca funcionam em conjunto

### Efeitos visuais
- Cosmos background em canvas
- Shooting stars
- Glow interno no hover dos cards
- Efeito 3D tilt
- Ripple no clique
- Rastro do mouse suave com fade (pontos interpolados)

## Estrutura do projeto

- `index.html` — estrutura da página e cards
- `style.css` — estilos gerais, cards, botões, animações
- `script.js` — cosmos canvas, trail do mouse, busca, filtros e efeitos

## Como rodar localmente

1. Baixe/clon​e o repositório
2. Abra o `index.html` no navegador

## Personalização rápida

No `script.js` (seção do rastro do mouse), você pode ajustar:

- `TRAIL_MAX` — quantidade máxima de pontos no rastro
- `MIN_DIST` — densidade dos pontos (menor = mais pontos)
- `FADE_SPEED` — velocidade do desaparecimento (menor = dura mais)

Também dá para trocar as cores em:
- `trailColors`
