import types from '../types';

const state = {
  historyRouter: [],
  activeRouter: ''
}

const getters = {
  getRouter (state) {
    return state.historyRouter;
  }
}

const actions = {

}

const mutations = {
  [types.ADDROUTER](state, param) {
    if(param.path == '/login' || param.path == '/welcome') return
    //let temp = state.historyRouter.indexOf(param);
    var temp = false;
    state.historyRouter.forEach(item=>{
      if(item.path == param.path){
        temp = true;
      }
    });
    if(!temp) {
      state.historyRouter.push(param);
    }
  },
  [types.DELETEROUTER](state, param) {
    let temp = state.historyRouter.indexOf(param);
    if(temp != -1) {
      state.historyRouter.splice(temp,1);
    }
  },
  [types.ACTIVEROUTER] (state, param) {
    state.activeRouter = param;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}