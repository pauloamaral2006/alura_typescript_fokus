interface Tarefa {
  descricao: string;
  concluida: boolean;
}

interface EstadoAplicacao {
  tarefas: Tarefa[];
  tarefaSelecionada: Tarefa | null;
  editando: boolean;
}

let estadoInicial: EstadoAplicacao = {
  tarefas: [
    {
      descricao: "Tarefa concluída",
      concluida: true,
    },
    {
      descricao: "Tarefa pendente 1",
      concluida: false,
    },
    {
      descricao: "Tarefa pendente 2",
      concluida: false,
    },
  ],
  tarefaSelecionada: null,
  editando: false,
};

const selecionarTarefa = (
  estado: EstadoAplicacao,
  tarefa: Tarefa
): EstadoAplicacao => {
  return {
    ...estado,
    tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa,
  };
};

const adicionarTarefa = (
  estado: EstadoAplicacao,
  tarefa: Tarefa
): EstadoAplicacao => {
  return {
    ...estado,
    tarefas: [...estado.tarefas, tarefa],
  };
};

const salvarTarefa = (
  estado: EstadoAplicacao,
  tarefa: Tarefa
): EstadoAplicacao => {
  const novasTarefas = estado.tarefas.map((t) =>
    t === estado.tarefaSelecionada ? { ...t, descricao: tarefa.descricao } : t
  );

  return {
    ...estado,
    tarefas: novasTarefas,
    tarefaSelecionada: null,
    editando: false,
  };
};
const deletar = (estado: EstadoAplicacao): EstadoAplicacao => {
  if (estado.tarefaSelecionada) {
    const tarefas = estado.tarefas.filter((t) => t != estado.tarefaSelecionada);
    return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
  } else {
    return estado;
  }
};

const deletarTodas = (estado: EstadoAplicacao): EstadoAplicacao => {
  return { ...estado, tarefas: [], tarefaSelecionada: null, editando: false };
};
// Deleta todas as tarefas concluídas. Retorna um novo estado.
const deletarTodasConcluidas = (estado: EstadoAplicacao): EstadoAplicacao => {
  const tarefas = estado.tarefas.filter((t) => !t.concluida);
  return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
};
// Modifica o estado para entrar no modo de edição. Retorna um novo estado.
const editarTarefa = (
  estado: EstadoAplicacao,
  tarefa: Tarefa
): EstadoAplicacao => {
  return { ...estado, editando: !estado.editando, tarefaSelecionada: tarefa };
};

const atualizarUI = () => {
  const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
</svg>`;

  const ulTarefas = document.querySelector(".app__section-task-list");
  const formAdicionarTarefa = document.querySelector<HTMLFormElement>(
    ".app__form-add-task"
  );
  const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>(
    ".app__button--add-task"
  );
  const textArea = document.querySelector<HTMLTextAreaElement>(
    ".app__form-textarea"
  );
  const labelTarefaAtiva = document.querySelector<HTMLParagraphElement>(
    ".app__section-active-task-description"
  );
  const btnCancelar: HTMLButtonElement = document.querySelector(
    ".app__form-footer__button--cancel"
  ) as HTMLButtonElement;
  const btnDeletar: HTMLButtonElement = document.querySelector(
    ".app__form-footer__button--delete"
  ) as HTMLButtonElement;
  const btnDeletarConcluidas: HTMLButtonElement = document.querySelector(
    "#btn-remover-concluidas"
  ) as HTMLButtonElement;
  const btnDeletarTodas: HTMLButtonElement = document.querySelector(
    "#btn-remover-todas"
  ) as HTMLButtonElement;
  labelTarefaAtiva!.textContent = estadoInicial.tarefaSelecionada
    ? estadoInicial.tarefaSelecionada.descricao
    : null;

  if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
    formAdicionarTarefa!.classList.remove("hidden");
    textArea!.value = estadoInicial.tarefaSelecionada.descricao;
  } else {
    formAdicionarTarefa!.classList.add("hidden");
    textArea!.value = "";
  }
  if (!btnAdicionarTarefa) {
    throw Error(
      "Caro colega, o elemento btnAdicionarTarefa não foi encontrado. Favor rever."
    );
  }

  btnAdicionarTarefa.onclick = () => {
    formAdicionarTarefa?.classList.toggle("hidden");
  };

  formAdicionarTarefa!.onsubmit = (evento) => {
    evento.preventDefault();
    const descricao = textArea!.value;

    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
      estadoInicial = salvarTarefa(estadoInicial, {
        ...estadoInicial.tarefaSelecionada,
        descricao: descricao,
      });
    } else {
      estadoInicial = adicionarTarefa(estadoInicial, {
        descricao,
        concluida: false,
      });
    }
    atualizarUI();
  };
  btnCancelar.onclick = () => {
    formAdicionarTarefa!.classList.add("hidden");
  };
  btnDeletar.onclick = () => {
    estadoInicial = deletar(estadoInicial);
    formAdicionarTarefa!.classList.add("hidden");
    atualizarUI();
  };
  btnDeletarConcluidas.onclick = () => {
    estadoInicial = deletarTodasConcluidas(estadoInicial);
    atualizarUI();
  };
  btnDeletarTodas.onclick = () => {
    estadoInicial = deletarTodas(estadoInicial);
    atualizarUI();
  };
  if (ulTarefas) {
    ulTarefas.innerHTML = "";
  }

  estadoInicial.tarefas.forEach((tarefa) => {
    const li = document.createElement("li");
    li.classList.add("app__section-task-list-item");

    const svgIcon = document.createElement("svg");
    svgIcon.innerHTML = taskIconSvg;

    const paragrafo = document.createElement("p");
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add("app__section-task-list-item-description");

    const botao = document.createElement("button");
    botao.classList.add("app_button-edit");

    const imagemBotao = document.createElement("img");
    imagemBotao.setAttribute("src", "/imagens/edit.png");
    botao.appendChild(imagemBotao);

    li.append(svgIcon);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.concluida) {
      li.classList.add("app__section-task-list-item-complete");
      botao.setAttribute("disabled", "true");
    }

    if (tarefa == estadoInicial.tarefaSelecionada) {
      li.classList.add("app__section-task-list-item-active");
    }

    li.append(svgIcon);
    li.append(paragrafo);
    li.append(botao);

    li.addEventListener("click", () => {
      estadoInicial = selecionarTarefa(estadoInicial, tarefa);
      atualizarUI();
    });
    botao.onclick = (evento) => {
      evento.stopPropagation();
      estadoInicial = editarTarefa(estadoInicial, tarefa);
      atualizarUI();
    };
    ulTarefas?.appendChild(li);
  });
};

document.addEventListener("TarefaFinalizada", () => {
  if (estadoInicial.tarefaSelecionada) {
    estadoInicial.tarefaSelecionada.concluida = true;
    atualizarUI()
  }
});

atualizarUI();
