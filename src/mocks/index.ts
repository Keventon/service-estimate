import { colors } from "@/types/colors";

export const services = [
  {
    id: "1",
    title: "Desenvolvimento de aplicativo de loja online",
    client: "Soluções Tecnológicas Beta",
    amount: "R$ 22.300,00",
    statusLabel: "Aprovado",
    statusBackgroundColor: colors.feedback.successLight,
    statusDotColor: colors.feedback.successBase,
  },
  {
    id: "2",
    title: "Consultoria em marketing digital",
    client: "Marketing Wizards",
    amount: "R$ 4.000,00",
    statusLabel: "Rascunho",
    statusBackgroundColor: colors.base.gray300,
    statusDotColor: colors.base.gray400,
  },
  {
    id: "3",
    title: "Serviços de SEO",
    client: "SEO Masters",
    amount: "R$ 3.500,00",
    statusLabel: "Enviado",
    statusBackgroundColor: colors.feedback.infoLight,
    statusDotColor: colors.feedback.infoBase,
  },
  {
    id: "4",
    title: "Criação de conteúdo",
    client: "Content Creators",
    amount: "R$ 2.500,00",
    statusLabel: "Rascunho",
    statusBackgroundColor: colors.base.gray300,
    statusDotColor: colors.base.gray400,
  },
];
