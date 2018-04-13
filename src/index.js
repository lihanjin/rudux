function stateChanger (state, action) {
  if (!state) {
    return {
      title: {
        text: 'React.js 小书',
        color: 'red',
      },
      content: {
        text: 'React.js 小书内容',
        color: 'blue'
      }
    }
  }
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      return {
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return {
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state
  }
}
function createStore(reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)//覆盖原对象
    listeners.forEach((listener) => listener())
  }
  dispatch({})// 初始化 state
  return { getState, dispatch, subscribe }
}



function renderApp(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  renderTitle(newAppState.title, oldAppState.title)
  renderContent(newAppState.content, oldAppState.content)
}

function renderTitle(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newAppState.text
  titleDOM.style.color = newAppState.color
}

function renderContent(newAppState, oldAppState = {}) {
  if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newAppState.text
  contentDOM.style.color = newAppState.color
}
// const store = createStore(appState, stateChanger)
// let oldState = store.getState() // 缓存旧的 state
// store.subscribe(() => {
//   const newState = store.getState() // 数据可能变化，获取新的 state
//   renderApp(newState, oldState) // 把新旧的 state 传进去渲染
//   oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
// })

// renderApp(store.getState()) // 首次渲染页面
// store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
// store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色

function themeReducer (state, action) {
  if (!state) return {
    themeName: 'Red Theme',
    themeColor: 'red'
  }
  switch (action.type) {
    case 'UPATE_THEME_NAME':
      return { ...state, themeName: action.themeName }
    case 'UPATE_THEME_COLOR':
      return { ...state, themeColor: action.themeColor }
    default:
      return state
  }
}

const store = createStore(themeReducer)