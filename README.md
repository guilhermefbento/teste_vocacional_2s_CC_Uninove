# Cidade Viva — organização da equipe

Ficha do 2º semestre de 2026 para mapear afinidades, disponibilidade e distribuir dez responsabilidades no projeto **Cidade Viva**.

## O que mudou em relação ao 1º semestre

- liderança fixa de Guilherme, acumulada com uma função prática;
- 10 funções práticas, uma para cada integrante;
- 12 perguntas situacionais objetivas;
- autoavaliação ancorada em comportamentos observáveis;
- alocação coletiva com uma função prática única por pessoa;
- uma função de apoio para cada integrante conhecer outra parte do projeto;
- nova integração com Google Sheets sem senha gravada no HTML;
- textos em UTF-8, formulário responsivo e melhorias de acessibilidade;
- documentação de responsabilidades, entregas e limitações do método.

## Ligar a uma nova planilha Google

1. Crie uma planilha vazia no Google Sheets, por exemplo `Cidade Viva — respostas 2026.2`.
2. Nela, abra **Extensões → Apps Script**.
3. Substitua o conteúdo do editor pelo arquivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Em **Configurações do projeto → Propriedades do script**, crie `ADMIN_PASSWORD` com uma senha longa e exclusiva.
5. Clique em **Implantar → Nova implantação → Aplicativo da Web**.
6. Execute como **você** e permita acesso a **qualquer pessoa com o link**. Isso permite receber respostas; a leitura continua protegida pelo `ADMIN_PASSWORD`.
7. Copie a URL terminada em `/exec` e cole em `SCRIPT_URL` no arquivo [`config.js`](config.js).
8. Faça commit e publique com GitHub Pages.

> Ao alterar o Apps Script, crie uma nova versão da implantação. Não coloque `ADMIN_PASSWORD` no GitHub.

## Teste local

Abrir `index.html` diretamente permite testar o questionário, mas o envio só funciona depois da configuração da planilha. Para servir localmente:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Uso do painel

O botão **Painel de organização** pede a chave administrativa, carrega a resposta mais recente de cada RA e calcula uma função prática diferente para cada pessoa. Guilherme Ferreira Bento continua como líder e também recebe normalmente uma dessas funções. A sugestão pode ser exportada em CSV.

Leia também:

- [Organização da equipe](docs/organizacao-equipe.md)
- [Metodologia e limitações](docs/metodologia-questionario.md)

## Privacidade

As respostas incluem nome, RA, e-mail educacional, disponibilidade e informações de trabalho. Restrinja o acesso à planilha aos responsáveis, não publique exportações com dados pessoais e exclua os dados quando a finalidade acadêmica terminar.
