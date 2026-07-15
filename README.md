# 🥖 Pão Expresso

Site responsivo para encomenda e agendamento de entregas de pães.

## Funcionalidades

- Cadastro e login de cliente
- Pedido avulso com data e horário
- Agendamento recorrente por dias da semana
- Seleção de produtos e cálculo automático do valor
- Layout responsivo para computador e celular
- Armazenamento local para demonstração

## Executar localmente

Abra o arquivo `index.html` no navegador ou use uma extensão como Live Server no VS Code.

## Publicação

O projeto possui um workflow em `.github/workflows/pages.yml` para publicação automática no GitHub Pages após cada alteração na branch `main`.

No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação.

## Importante

Esta primeira versão utiliza `localStorage`, portanto os dados ficam apenas no navegador do usuário. Para produção, será necessário conectar uma API e um banco de dados, como Supabase, além de implementar autenticação segura e integração de pagamento.
