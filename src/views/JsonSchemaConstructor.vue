<template>
  <div class="app-container">
    <!-- Левая часть -->
    <div class="pane-left">
      <pre id="code-output" class="code-output">{}</pre>
    </div>

    <!-- Правая часть -->
    <div class="pane-right" id="pane-right">

      <!-- Панель 1: Управление -->
      <div class="panel" id="panel-1">
        <div class="top-controls">
          <div id="schema-select-container" style="flex: 1;"></div>
          <input type="text" id="schema-name" placeholder="Имя новой схемы" style="flex: 1;">
          <div id="shablon-select-container" style="flex: 1;"></div>
          <button class="btn" id="btn-create-schema">Создать</button>
          <button class="btn btn-danger" id="btn-clear-project">Очистить</button>
        </div>
      </div>

      <!-- Панель 2: Конструктор -->
      <div class="panel" id="panel-2">
        <div id="blocks-container" class="blocks-container"></div>
        <div class="add-block-wrapper">
          <button class="btn btn-add-block" id="btn-add-block">+ Добавить сущность (блок)</button>
        </div>
      </div>

      <div class="resizer-h" id="resizer-2"></div>

      <!-- Панель 3: Справка -->
      <div class="panel" id="panel-3">
        <div class="help-header">
          <span style="color: var(--text-muted); font-size: 14px;">Справка и подсказки</span>
          <div id="help-select-container" style="width: 300px;"></div>
        </div>
        <div id="help-content">
          <div style="color: var(--text-muted); font-size: 14px;">
            Выберите тип страницы или нажмите "?" рядом с полем.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Глобальные переменные для данных из JSON
let entitiesData = {};
let helpData = { pageHelp: {}, fieldHelp: {} };
let shablonsData = {};
let newSchemaShablon = ""; // Выбранный шаблон при создании схемы

let state = {
  activeSchemaId: null,
  schemas: {}
};

// ================= АСИНХРОННАЯ ЗАГРУЗКА ИЗ ПАПКИ =================
async function fetchSchemaConfig() {
  try {
    const [entitiesRes, helpRes, shablonsRes] = await Promise.all([
      // Убрали /public/ из начала пути — теперь файлы ищутся от корня сайта
      fetch('data-shema/entities.json'),
      fetch('data-shema/help.json'),
      fetch('data-shema/shablons.json')
    ]);

    if (!entitiesRes.ok || !helpRes.ok || !shablonsRes.ok) {
      throw new Error('Не удалось загрузить конфигурационные файлы');
    }

    entitiesData = await entitiesRes.json();
    helpData = await helpRes.json();
    shablonsData = await shablonsRes.json();
  } catch (err) {
    console.error('Ошибка инициализации данных. Проверьте пути /data-shema/ и запущен ли локальный сервер:', err);
    entitiesData = {};
    helpData = { pageHelp: {}, fieldHelp: {} };
    shablonsData = {};
  }
}

// ================= ИНИЦИАЛИЗАЦИЯ И РЕСАЙЗ =================
function initResizer() {
  const p3 = document.getElementById('panel-3');
  const resizer2 = document.getElementById('resizer-2');
  let startY = 0, startH3 = 0, isDragging = false;

  const savedH3 = localStorage.getItem('schemaBuilder_h3');
  if (savedH3) p3.style.height = `${savedH3}px`;

  resizer2.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startH3 = p3.getBoundingClientRect().height;
    document.body.style.cursor = 'ns-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = startY - e.clientY;
    const newH3 = startH3 + delta;
    if (newH3 > 100 && newH3 < window.innerHeight * 0.8) {
      p3.style.height = `${newH3}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = 'default';
      localStorage.setItem('schemaBuilder_h3', p3.getBoundingClientRect().height);
    }
  });
}

// ================= СОСТОЯНИЕ =================
function loadState() {
  const saved = localStorage.getItem('schemaBuilder_data');
  if (saved) state = JSON.parse(saved);
}

function saveState() {
  localStorage.setItem('schemaBuilder_data', JSON.stringify(state));
  renderCode();
}

function generateId() { return '_' + Math.random().toString(36).substr(2, 9); }

// ================= КАСТОМНЫЙ ДРОПДАУН =================
function createDropdown(options, value, placeholder, onChange, allowCustom = false) {
  const container = document.createElement('div');
  container.className = 'custom-dropdown';

  const trigger = document.createElement('div');
  trigger.className = 'dropdown-trigger';
  if (!value) trigger.classList.add('placeholder');

  const selectedOpt = options.find(o => o.value === value);
  trigger.innerHTML = `<span>${selectedOpt ? selectedOpt.label : placeholder}</span><span class="arrow">▼</span>`;

  const menu = document.createElement('ul');
  menu.className = 'dropdown-menu';
  menu.style.display = 'none';

  // --- ДОБАВЛЕНИЕ СВОЕЙ СУЩНОСТИ ---
  if (allowCustom) {
    const liInput = document.createElement('li');
    liInput.style.padding = '6px 10px';
    liInput.style.borderBottom = '1px solid var(--border-color)';
    liInput.style.cursor = 'default';

    // Отключаем стандартный ховер-эффект списка для зоны ввода
    liInput.onmouseover = () => { liInput.style.backgroundColor = 'transparent'; };
    liInput.onclick = (e) => e.stopPropagation();

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '6px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Имя новой сущности...';
    input.style.padding = '6px 8px';
    input.style.fontSize = '13px';
    input.style.flex = '1';

    // Предотвращаем закрытие меню при взаимодействии с инпутом
    input.onclick = (e) => e.stopPropagation();
    input.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = input.value.trim();
        if (val) {
          menu.style.display = 'none';
          trigger.querySelector('.arrow').classList.remove('open');
          onChange(val);
        }
      }
    };

    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn';
    btnAdd.style.padding = '4px 8px';
    btnAdd.style.fontSize = '12px';
    btnAdd.textContent = '+';
    btnAdd.onclick = (e) => {
      e.stopPropagation();
      const val = input.value.trim();
      if (val) {
        menu.style.display = 'none';
        trigger.querySelector('.arrow').classList.remove('open');
        onChange(val);
      }
    };

    inputContainer.appendChild(input);
    inputContainer.appendChild(btnAdd);
    liInput.appendChild(inputContainer);
    menu.appendChild(liInput);
  }

  options.forEach(opt => {
    const li = document.createElement('li');
    li.textContent = opt.label;
    if (opt.value === value) li.classList.add('active');
    li.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = 'none';
      trigger.querySelector('.arrow').classList.remove('open');
      onChange(opt.value);
    };
    menu.appendChild(li);
  });

  trigger.onclick = (e) => {
    e.stopPropagation();
    const isOpen = menu.style.display === 'block';
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.arrow').forEach(a => a.classList.remove('open'));
    if (!isOpen) {
      menu.style.display = 'block';
      trigger.querySelector('.arrow').classList.add('open');

      // Автофокус на инпут при открытии меню
      if (allowCustom) {
        const customInput = menu.querySelector('input');
        if (customInput) {
          setTimeout(() => customInput.focus(), 50);
        }
      }
    }
  };

  container.appendChild(trigger);
  container.appendChild(menu);
  return container;
}

// ================= ЛОГИКА ДЕРЕВА ПОЛЕЙ =================
function findNodeWithParent(fields, targetId, parentNode = null, parentArray = fields) {
  for (let i = 0; i < parentArray.length; i++) {
    if (parentArray[i].id === targetId) return { node: parentArray[i], index: i, parentArray, parentNode };
    if (parentArray[i].children) {
      const res = findNodeWithParent(fields, targetId, parentArray[i], parentArray[i].children);
      if (res) return res;
    }
  }
  return null;
}

function addField(fields, targetId) {
  const info = findNodeWithParent(fields, targetId);
  if (info) {
    info.parentArray.splice(info.index + 1, 0, {
      id: generateId(),
      key: "",
      value: "",
      isArrayItem: info.node.isArrayItem 
    });
  }
}

function moveFieldRight(fields, targetId) {
  const info = findNodeWithParent(fields, targetId);
  if (info && info.index > 0) {
    const prevSibling = info.parentArray[info.index - 1];
    if (!prevSibling.children) prevSibling.children = [];
    info.parentArray.splice(info.index, 1);
    prevSibling.children.push(info.node);
  }
}

function moveFieldLeft(rootFields, targetId) {
  const info = findNodeWithParent(rootFields, targetId);
  if (info && info.parentNode) {
    const parentInfo = findNodeWithParent(rootFields, info.parentNode.id);
    if (parentInfo) {
      info.parentArray.splice(info.index, 1);
      if (info.parentArray.length === 0) delete info.parentNode.children;
      parentInfo.parentArray.splice(parentInfo.index + 1, 0, info.node);
    }
  }
}

function removeField(fields, targetId) {
  const info = findNodeWithParent(fields, targetId);
  if (info) info.parentArray.splice(info.index, 1);
}

// ================= РЕНДЕР =================
function renderCode() {
  const codeBlock = document.getElementById('code-output');
  if (!state.activeSchemaId || !state.schemas[state.activeSchemaId]) {
    codeBlock.textContent = "{}"; return;
  }
  const schema = state.schemas[state.activeSchemaId];
  const result = {
    "@context": "https://schema.org",
    "@graph": schema.blocks.map(block => {
      const obj = { "@type": block.entity };

      const build = (arr) => {
        let res = {};
        arr.forEach(f => {
          if (!f.key) return;

          let val;

          if (f.isArray) {
            val = f.children.map(item => build(item.children));
          } else {
            val = f.children ? build(f.children) : f.value;
          }

          if (res.hasOwnProperty(f.key)) {
            if (Array.isArray(res[f.key])) {
              res[f.key].push(val);
            } else {
              res[f.key] = [res[f.key], val];
            }
          } else {
            res[f.key] = val;
          }
        });

        const keys = Object.keys(res);
        if (keys.length === 1 && Array.isArray(res[keys[0]])) {
          const keyName = keys[0];
          return res[keyName].map(item => ({ [keyName]: item }));
        }

        return res;
      };

      return { ...obj, ...build(block.fields) };
    })
  };
  codeBlock.textContent = JSON.stringify(result, null, 2);
}

function renderSelects() {
  const schemasOpts = Object.entries(state.schemas).map(([id, s]) => ({ value: id, label: s.name }));
  const schemaContainer = document.getElementById('schema-select-container');
  schemaContainer.innerHTML = '';
  schemaContainer.appendChild(createDropdown(schemasOpts, state.activeSchemaId, "Выберите схему...", (val) => {
    state.activeSchemaId = val; saveState(); renderBlocks(); renderSelects();
  }));

  const helpOpts = Object.entries(helpData.pageHelp).map(([k, v]) => ({ value: k, label: v.title }));
  const helpContainer = document.getElementById('help-select-container');
  helpContainer.innerHTML = '';
  helpContainer.appendChild(createDropdown(helpOpts, "", "Тип страницы...", (val) => {
    const content = document.getElementById('help-content');
    content.innerHTML = `<div class="help-item"><div class="help-item-title">${helpData.pageHelp[val].title}</div>${helpData.pageHelp[val].info}</div>`;
  }));

  const shablonOpts = [{ value: "", label: "Без шаблона (пустая)" }];
  Object.entries(shablonsData).forEach(([k, v]) => {
    shablonOpts.push({ value: k, label: v.name });
  });

  const shablonContainer = document.getElementById('shablon-select-container');
  shablonContainer.innerHTML = '';
  shablonContainer.appendChild(createDropdown(shablonOpts, newSchemaShablon, "Шаблон...", (val) => {
    newSchemaShablon = val;
    renderSelects(); 
  }));
}

function renderFieldsTree(rootFields, fields, parentEl) {
  const tree = document.createElement('div');
  tree.className = 'fields-tree';

  fields.forEach((field, index) => {
    const row = document.createElement('div');
    row.className = 'field-row';

    const controls = document.createElement('div');
    controls.className = 'field-controls';

    const btnLeft = document.createElement('button');
    btnLeft.className = 'btn-icon'; btnLeft.textContent = '←'; btnLeft.title = "Вынести на уровень выше";
    btnLeft.onclick = () => { moveFieldLeft(rootFields, field.id); saveState(); renderBlocks(); };

    const btnRight = document.createElement('button');
    btnRight.className = 'btn-icon'; btnRight.textContent = '→'; btnRight.title = "Вложить в предыдущее";
    btnRight.onclick = () => { moveFieldRight(rootFields, field.id); saveState(); renderBlocks(); };

    const btnAddSibling = document.createElement('button');
    btnAddSibling.className = 'btn-icon'; btnAddSibling.textContent = '+'; btnAddSibling.title = "Добавить поле ниже";
    btnAddSibling.onclick = () => { addField(rootFields, field.id); saveState(); renderBlocks(); };

    const btnAddChild = document.createElement('button');
    btnAddChild.className = 'btn-icon'; btnAddChild.textContent = '↳'; btnAddChild.title = "Добавить вложенное поле";
    btnAddChild.onclick = () => {
      if (!field.children) field.children = [];
      field.children.push({ id: generateId(), key: "", value: "" });
      if (field.value !== undefined) delete field.value;
      saveState(); renderBlocks();
    };

    const btnRemove = document.createElement('button');
    btnRemove.className = 'btn-icon'; btnRemove.style.color = "var(--danger)"; btnRemove.textContent = '×'; btnRemove.title = "Удалить";
    btnRemove.onclick = () => { removeField(rootFields, field.id); saveState(); renderBlocks(); };

    const nodeInfo = findNodeWithParent(rootFields, field.id);
    if (!nodeInfo || !nodeInfo.parentNode) btnLeft.disabled = true;
    if (!nodeInfo || nodeInfo.index === 0) btnRight.disabled = true;

    controls.append(btnLeft, btnRight, btnAddSibling, btnAddChild, btnRemove);

    const inputs = document.createElement('div');
    inputs.className = 'field-inputs';

    if (!field.isArrayItem) {
      const inputKey = document.createElement('input');
      inputKey.className = 'field-key'; inputKey.value = field.key || ""; inputKey.placeholder = "Ключ (напр. step)";
      inputKey.oninput = (e) => { field.key = e.target.value; saveState(); };
      inputs.appendChild(inputKey);
    } else {
      const itemLabel = document.createElement('span');
      itemLabel.className = 'field-key';
      itemLabel.style.color = "var(--text-muted)";
      itemLabel.textContent = `[Элемент ${index + 1}]`;
      inputs.appendChild(itemLabel);
    }

    if (!field.isArrayItem) {
      const isArr = field.isArray;
      const isObj = field.children && !field.isArray;
      const currentVal = isArr ? 'array' : (isObj ? 'object' : 'string');

      const typeOptions = [
        { value: 'string', label: 'Строка' },
        { value: 'object', label: 'Объект' },
        { value: 'array', label: 'Массив' }
      ];

      const typeDropdown = createDropdown(typeOptions, currentVal, "Тип", (val) => {
        if (val === 'string') {
          delete field.children;
          delete field.isArray;
          field.value = "";
        } else if (val === 'object') {
          field.children = [];
          delete field.isArray;
          delete field.value;
        } else if (val === 'array') {
          field.isArray = true;
          field.children = [];
          delete field.value;
        }
        saveState();
        renderBlocks();
      });

      typeDropdown.style.flex = "0.3";
      typeDropdown.style.minWidth = "110px";

      inputs.appendChild(typeDropdown);
    }

    if (!field.children && !field.isArray && !field.isArrayItem) {
      const inputVal = document.createElement('input');
      inputVal.className = 'field-val'; inputVal.value = field.value || ""; inputVal.placeholder = "Значение";
      inputVal.oninput = (e) => { field.value = e.target.value; saveState(); };
      inputs.appendChild(inputVal);
    } else if (field.isArray) {
      const btnAddItem = document.createElement('button');
      btnAddItem.className = 'btn';
      btnAddItem.style.flex = "1";
      btnAddItem.textContent = '+ Добавить элемент массива';
      btnAddItem.onclick = () => {
        if (!field.children) field.children = [];
        field.children.push({
          id: generateId(),
          isArrayItem: true,
          children: [
            { id: generateId(), key: "", value: "" }
          ]
        });
        saveState(); renderBlocks();
      };
      inputs.appendChild(btnAddItem);
    } else {
      const typeLabel = document.createElement('span');
      typeLabel.style.color = "var(--text-muted)";
      typeLabel.style.flex = "1";
      typeLabel.style.marginLeft = "8px";
      typeLabel.textContent = "{ Вложенные поля }";
      inputs.appendChild(typeLabel);
    }

    const btnHelp = document.createElement('button');
    btnHelp.className = 'btn-icon btn-help'; btnHelp.textContent = '?';
    btnHelp.onclick = () => showFieldHelp(field.key);
    inputs.appendChild(btnHelp);

    row.append(controls, inputs);
    tree.appendChild(row);

    if (field.children) {
      const indent = document.createElement('div');
      indent.className = 'field-indent';
      renderFieldsTree(rootFields, field.children, indent);
      tree.appendChild(indent);
    }
  });
  parentEl.appendChild(tree);
}

function showFieldHelp(key) {
  if (!key) return;
  const content = document.getElementById('help-content');
  const text = helpData.fieldHelp[key] || `Заметки для поля "${key}" отсутствуют в словаре. Вы можете добавить их в конфигурационный файл help.json.`;

  const el = document.createElement('div');
  el.className = 'help-item';
  el.innerHTML = `<div class="help-item-title">Поле: ${key}</div><div>${text}</div>`;

  content.prepend(el);
}

function objectToFields(obj) {
  const f = [];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {

      const children = [];

      v.forEach(item => {
        children.push({
          id: generateId(),
          isArrayItem: true,
          children:
            typeof item === "object" && item !== null
              ? objectToFields(item)
              : [{
                id: generateId(),
                key: "",
                value: String(item)
              }]
        });
      });

      f.push({
        id: generateId(),
        key: k,
        isArray: true,
        children
      });

    } else if (typeof v === 'object' && v !== null) {
      f.push({ id: generateId(), key: k, value: "", children: objectToFields(v) });
    } else {
      f.push({ id: generateId(), key: k, value: String(v) });
    }
  }
  return f;
}

function renderBlocks() {
  const container = document.getElementById('blocks-container');
  container.innerHTML = '';
  if (!state.activeSchemaId || !state.schemas[state.activeSchemaId]) return;

  const blocks = state.schemas[state.activeSchemaId].blocks;

  blocks.forEach((block, index) => {
    const card = document.createElement('div');
    card.className = 'block-card';

    const header = document.createElement('div');
    header.className = 'block-header';

    const entOpts = Object.keys(entitiesData).map(e => ({ value: e, label: e }));
    if (block.entity && !entitiesData[block.entity]) {
      entOpts.push({ value: block.entity, label: `${block.entity} (Custom)` });
    }

    const drop = createDropdown(entOpts, block.entity, "Выберите сущность...", (val) => {
      block.entity = val;
      if (entitiesData[val]) {
        block.fields = objectToFields(entitiesData[val]);
      } else {
        block.fields = [];
      }
      saveState(); renderBlocks();
    }, true);

    const btnRemove = document.createElement('button');
    btnRemove.className = 'btn btn-danger'; btnRemove.textContent = 'Удалить';
    btnRemove.onclick = () => { blocks.splice(index, 1); saveState(); renderBlocks(); };

    header.append(drop, btnRemove);
    card.appendChild(header);

    if (block.fields.length > 0) {
      renderFieldsTree(block.fields, block.fields, card);
    } else if (block.entity) {
      const btnInit = document.createElement('button');
      btnInit.className = 'btn btn-secondary'; btnInit.textContent = '+ Создать первое поле';
      btnInit.style.marginTop = '12px';
      btnInit.onclick = () => { block.fields.push({ id: generateId(), key: "", value: "" }); saveState(); renderBlocks(); };
      card.appendChild(btnInit);
    }

    container.appendChild(card);
  });
}

// Асинхронный запуск всего приложения после полной загрузки настроек
async function init() {
  initResizer();
  loadState();
  await fetchSchemaConfig();
  renderSelects();
  renderBlocks();
  renderCode();
}

// Обработчик закрытия дропдаунов по клику вне области
const handleDocumentClick = () => {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
  document.querySelectorAll('.arrow').forEach(a => a.classList.remove('open'));
};

// ================= СОБЫТИЯ Vue Lifecycle =================
onMounted(() => {
  // Вешаем слушатель клика на документ
  document.addEventListener('click', handleDocumentClick);

  // Привязываем события к кнопкам только ПОСЛЕ того, как Vue отрисовал HTML
  document.getElementById('btn-create-schema').onclick = () => {
    const name = document.getElementById('schema-name').value.trim();
    if (!name) return;

    const id = generateId();
    const blocks = [];

    if (newSchemaShablon && shablonsData[newSchemaShablon]) {
      const entitiesList = shablonsData[newSchemaShablon].entities;

      entitiesList.forEach(entityName => {
        const block = { entity: entityName, fields: [] };
        if (entitiesData[entityName]) {
          block.fields = objectToFields(entitiesData[entityName]);
        }
        blocks.push(block);
      });
    }

    state.schemas[id] = { name, blocks };
    state.activeSchemaId = id;
    document.getElementById('schema-name').value = '';
    newSchemaShablon = ""; 

    saveState();
    renderSelects();
    renderBlocks();
  };

  document.getElementById('btn-add-block').onclick = () => {
    if (!state.activeSchemaId) return alert("Сначала выберите или создайте схему!");
    state.schemas[state.activeSchemaId].blocks.push({ entity: "", fields: [] });
    saveState(); renderBlocks();
  };

  document.getElementById('btn-clear-project').onclick = () => {
    if (confirm("Удалить все схемы?")) {
      state = { activeSchemaId: null, schemas: {} };
      saveState(); renderSelects(); renderBlocks();
    }
  };

  // Запускаем основную логику приложения
  init();
});

// Убираем слушатель, если компонент будет уничтожен (хорошая практика во Vue)
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style>
/* ================= БАЗОВЫЙ CSS ПРОЕКТА ================= */



.btn:hover {
  border-color: var(--text-muted);
  background-color: #222224;
}

.btn-danger {
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--danger);
  padding: 6px 12px;
}

.btn-danger:hover {
  background-color: rgba(244, 63, 94, 0.1);
  border-color: var(--danger);
}

/* Кастомный дропдаун */
.custom-dropdown {
  position: relative;
  user-select: none;
  flex: 1;
}

.dropdown-trigger {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  transition: border-color 0.2s;
}

.dropdown-trigger:hover {
  border-color: var(--text-muted);
}

.dropdown-trigger.placeholder {
  color: var(--text-muted);
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 0;
  margin: 0;
  list-style: none;
  z-index: 10;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  max-height: 250px;
  overflow-y: auto;
}

.dropdown-menu li {
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-main);
  transition: background-color 0.15s;
}

.dropdown-menu li:hover {
  background-color: var(--bg-input);
}

.dropdown-menu li.active {
  background-color: var(--accent);
  color: #000000;
  font-weight: 500;
}

/* Скроллбары */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: var(--bg-main);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-muted);
}

/* ================= CSS КОНСТРУКТОРА ================= */
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* Левая часть: Код */
.pane-left {
  width: 40%;
  background-color: var(--bg-main);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.code-output {
  flex: 1;
  margin: 0;
  padding: 20px;
  overflow: auto;
  color: #9cdcfe;
  font-family: Consolas, "Courier New", monospace;
  font-size: 14px;
  background-color: #1e1e1e;
}

/* Правая часть: Панели */
.pane-right {
  width: 60%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
}

.panel {
  padding: 16px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#panel-1 {
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
}

#panel-2 {
  flex: 1 1 auto;
  overflow: auto;
  min-height: 100px;
}

#panel-3 {
  height: 250px;
  flex-shrink: 0;
  overflow: auto;
  background: var(--bg-card);
}

.resizer-h {
  height: 6px;
  background-color: var(--border-color);
  cursor: ns-resize;
  flex-shrink: 0;
  z-index: 10;
  transition: background-color 0.2s;
}

.resizer-h:hover,
.resizer-h.active {
  background-color: var(--text-muted);
}

.top-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Конструктор блоков */
.blocks-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.block-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.fields-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-indent {
  margin-left: 28px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
  margin-top: 8px;
  margin-bottom: 8px;
}

/* Кнопки управления полем */
.field-controls {
  display: flex;
  gap: 4px;
  opacity: 0.2;
  transition: opacity 0.2s;
}

.field-row:hover .field-controls {
  opacity: 1;
}

.btn-icon {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  color: var(--text-main);
  border-color: var(--text-main);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-help {
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: bold;
}

.btn-help:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.field-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
  align-items: center;
}

.field-inputs input {
  padding: 8px 12px;
}

.field-key {
  flex: 0.4;
}

.field-val {
  flex: 0.6;
}

.add-block-wrapper {
  margin-top: 16px;
  text-align: center;
}

.btn-add-block {
  width: 100%;
  border: 1px dashed var(--border-color);
  background: transparent;
  padding: 12px;
  font-size: 16px;
}

.btn-add-block:hover {
  border-color: var(--text-muted);
  background: var(--bg-card);
}

/* Справка */
.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.help-item {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  animation: highlight 2s ease-out;
}

.help-item-title {
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}

@keyframes highlight {
  0% {
    border-color: var(--accent);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  100% {
    border-color: var(--border-color);
    box-shadow: none;
  }
}
</style>