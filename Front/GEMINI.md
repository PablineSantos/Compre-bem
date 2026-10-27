# Diretrizes de Contexto, Memória e Execução

### Uso da Memória (MCP Memory)
- Consulte a memória persistida no início de tarefas complexas para recuperar convenções e regras de arquitetura.
- Salve novas entidades na memória apenas quando eu definir decisões estáveis de arquitetura, contratos de API ou regras de negócio.
- Nunca apague ou altere entidades da memória sem confirmação explícita.

### Busca no Código (MCP Ripgrep)
- Para localizar funções, interfaces, variáveis ou rotas, use a ferramenta de ripgrep em vez de ler diretórios inteiros.
- Ao encontrar o trecho desejado, leia apenas o arquivo específico antes de propor edições.

### Respostas e Economia de Tokens
- Seja direto e conciso. Não adicione saudações, introduções óbvias ou recapitulações.
- Ao sugerir edições de código, forneça apenas os blocos ou diffs necessários, sem replicar o arquivo inteiro.