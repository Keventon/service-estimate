Service Estimate - Regras de Projeto para IA

1) Stack e arquitetura
- Expo Router com React Native + TypeScript; telas estao em src/app usando convencao de rotas (index, [id], newService, editService)
- Biblioteca de bottom sheet: @gorhom/bottom-sheet (Backdrop sempre com opacidade 0.3, handle oculto, snap points ~65-75%)
- GestureHandlerRootView envolve telas que usam gestures/bottom sheet
- Navegacao para detalhes usa router.push com pathname '/[id]' e param id sem o caractere '#'

2) Design tokens e fontes
- Cores em src/styles/colors.ts: roxo principal (purpleBase #6A46EB + purpleLight #DFDAF2), escala de cinza (gray100-700), e paleta feedback (success/info/danger) usada para status e avisos
- Tipografia fixa em src/styles/fontFamily.ts: Lato_400Regular e Lato_700Bold; sempre usar fontFamily.regular/bold
- Fundo de app branco; cards com fundo branco, borda cinza clara (gray300) e radius 10-16; chips e badges usam radius 6-14; botoes pill radius 44-99
- Espacamentos mais comuns: margem/padding horizontais 16-24; gaps 8-12-16

3) Componentes reutilizaveis
- Input: pill cinza claro, altura 48, texto regular 16, cursor e selection na cor roxa
- SearchInput: icone Search cinza, input flex, altura 48, border radius 99
- Button primario: roxo base, altura 48, icone Plus + texto bold 14 branco, padding 12/24, gap 8
- FeedbackModal: usado para confirmacoes/avisos; tipos info|success|warning|danger mapeiam para cores em colors.feedback; botoes primario colorido + secundario cinza claro
- Service card: fundo cinza claro, radius 16, gap 12; badge de status com cor vinda do status; clica e abre detalhes pelo router
- FilterBottomSheet: filtros de status (labels Rascunho, Enviado, Aprovado, Recusado) com checkbox e badge de cor; ordenacao (recent, old, higher, lower) com radio customizado; botoes Resetar e Aplicar (icone Check)

4) Status e rotulacao
- Status interno: "draft" | "sent" | "approved" | "rejected" (type ServiceStatus)
- Labels visiveis: draft->Rascunho, sent->Enviado, approved->Aprovado, rejected->Recusado
- Badge de status usa combina: draft gray300/gray400, sent infoLight/infoBase, approved successLight/successBase, rejected dangerLight/dangerBase

5) Dados e armazenamento
- Tipos principais em src/types/service.ts (ServiceDetail, ServiceItem)
- Persistencia em AsyncStorage, chave @service-estimate:services
- Funcoes utilitarias em src/service/storage.ts: ensureIdPrefix (usa '#'), getServices, getServiceById, upsertService (insert/update mantendo '#'), deleteService
- ID visual sempre prefixado com '#'; ao navegar via rota remover '#' do param

6) Formatacao e logica numerica
- Moeda: Intl.NumberFormat pt-BR com BRL ou toLocaleString('pt-BR')
- Desconto: percent no intervalo 0-100, desconto calculado em cima do subtotal; total = subtotal - desconto; exibir subtotal riscado quando houver desconto
- Totais e quantidade de itens calculados a partir da lista de servicesIncluded (amount * qty)

7) Padrões de UI/UX das telas
- Header simples com botao voltar (ChevronLeft) + titulo; topo deslocado (Android +40, iOS +68)
- Divisor fino gray300 entre seções
- Cards de seções: Informacoes Gerais, Status, Servicos inclusos, Investimento
- Bottom sheet para adicionar/editar servico: inputs com borda arredondada, textarea com radius 14, controle de quantidade com botoes Minus/Plus, botao Salvar roxo e excluir em cinza claro
- Rodapes fixos com botoes pill: outline cinza para Cancelar, roxo para Salvar/Compartilhar; icones lucide com strokeWidth ~1.3-2
- Lista principal (index) usa FlatList com padding 24/12, mensagem vazia centralizada em cinza

8) Texto e idioma
- Copy em pt-BR informal direto ("Voce tem 1 item em rascunho", "Servicos inclusos", "Valor total", "Resetar filtros")
- Evitar inglês em labels novos; manter tons curtos e amigaveis

9) Estilo de codigo
- TypeScript com tipos explicitos (ServiceDetail, ServiceItem, ServiceStatus)
- Hooks React para estado e efeitos; useFocusEffect para carregar dados de storage e limpar em unmount
- Evitar logica inline complexa; preferir helpers pequenos (e.g., formatCurrency, map de status)
- Components funcionais com props tipadas; sem estado global nem redux
- Navegacao via expo-router (router.navigate/push/back); parametros de rota strings

10) Checklist para novas features
- Reutilize tokens de cor e fontes de src/styles
- Respeite labels pt-BR e mapeamento de status
- Qualquer novo dado persistente deve passar por AsyncStorage com o prefixo '#'
- Formatos numericos: pt-BR, BRL; sanitize inputs removendo caracteres nao numericos
- Siga layout: cards brancos com borda gray300, radius 10-16; botoes pill; gaps 8-16
- Se usar bottom sheet, ocultar handle, snap point unico ~70% e backdrop opaco 0.3
- Sempre considerar platform offsets (Android vs iOS) para paddings de topo
