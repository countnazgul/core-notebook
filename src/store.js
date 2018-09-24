import Vue from 'vue'
import Vuex from 'vuex'
import enigma from 'enigma.js'
// import WebSocket from 'ws'
import schema from 'enigma.js/schemas/12.20.0.json'
import uuid from 'uuid/v4'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [
      {
        id: 1,
        name: 'Core Local 1',
        host: 'localhost',
        port: '9076'
      },
      {
        id: 2,
        name: 'Core Local 2',
        host: 'localhost',
        port: '9076'
      },
      {
        id: 3,
        name: 'Core Local 3',
        host: 'localhost',
        port: '9076'
      }
    ],
    enigmaInstance: {
      global: {},
      app: {},
      session: {}
    },
    sectionText: '',
    notes: [
      {
        id: 1,
        serverId: 1,
        appId: '/home/nobody/Qlik/Sense/Apps/reloadapp.qvf',
        code: 'sum(1)',
        title: 'My new expression',
        expanded: true
      }
    ],
  },
  mutations: {
    SET_ENIGMA_INSTANCE: function (state, { global, session }) {
      state.enigmaInstance.global = global
      state.enigmaInstance.session = session
    },
    ADD_NOTE: function (state, n) {
      state.notes.push(n)
    },
    REMOVE_NOTE: function (state, id) {
      state.notes = state.notes.filter(function (n) {
        return n.id != id
      })
    },
    REMOVE_ALL_NOTES: function (state, { serverId, appId }) {
      state.notes = state.notes.filter(function (n) {
        return (n.serverId != serverId && n.appId != appId)
      })
    },
    UPDATE_NOTE: function (state, n) {
      for (let note in state.notes) {
        if (n.id == note.id) {
          note = n
        }
      }
    },
    ADD_SERVER: function (state) {
      state.servers.push({
        id: uuid(),
        name: '',
        host: '',
        port: ''
      })
    },
    DELETE_SERVER: function (state, server) {
      state.servers = state.servers.filter(function (s) {
        return s.id != server.id
      })
    },
    SET_SECTION: function (state, section) {
      state.sectionText = section
    },
    SAVE_SERVER: function (state, server) {
      for (let s of state.servers) {
        if (s.id == server.id) {
          s = server
        }
      }
    },
    COLLAPSE_ALL: function (state, { serverId, appId, expanded }) {
      for (let n of state.notes) {
        if (n.serverId == serverId && n.appId == appId) {
          n.expanded = expanded
        }
      }
    }
  },
  actions: {
    addNote: async function ({ commit }, { serverId, appId }) {
      let n = { id: uuid(), serverId: serverId, appId: appId, code: '//** Expression\n', title: 'Expression', expanded: true }
      commit('ADD_NOTE', n)
      return n
    },
    getNotebook: async function ({ commit, state }, { serverId, appId }) {
      let notes = state.notes.filter(function (n) {
        return (n.serverId == serverId && n.appId == appId)
      })

      return notes
    },
    openConnection: async function ({ commit, state }, server) {
      try {
        await state.enigmaInstance.session.close();
      } catch (e) {
        // console.log(e);
      }

      commit('SET_ENIGMA_INSTANCE', { global: {}, session: {} })

      const session = enigma.create({
        schema,
        url: `ws://${server.host}:${server.port}/app/engineData`,
        createSocket: url => new WebSocket(url),
      });

      // bind traffic events to log what is sent and received on the socket:
      // session.on('traffic:sent', data => console.log('sent:', data));
      // session.on('traffic:received', data => console.log('received:', data));

      try {
        let global = await session.open()
        let docs = await global.getDocList()
        commit('SET_ENIGMA_INSTANCE', { global: global, session: session })
        return docs
      } catch (e) {
        console.log('Something wrong!')
        return false
      }
    },
    removeNote: async function ({ commit }, id) {
      commit('REMOVE_NOTE', id)
    },
    removeAllNotes: async function ({ commit }, { serverId, appId }) {
      commit('REMOVE_ALL_NOTES', { serverId, appId })
    },
    updateNote: async function ({ commit }, note) {
      commit('UPDATE_NOTE', note)
    },
    addServer: async function ({ commit }) {
      commit('ADD_SERVER')
    },
    deleteServer: async function ({ commit }, server) {
      commit('DELETE_SERVER', server)
    },
    saveServer: async function ({ commit }, server) {
      commit('SAVE_SERVER', server)
    },
    setSection: async function ({ commit }, section) {
      commit('SET_SECTION', section)
    },
    collapseAll: async function ({ commit }, { serverId, appId, expanded }) {
      commit('COLLAPSE_ALL', { serverId, appId, expanded })
    },
    deleteAll: async function ({ commit }, { serverId, appId }) {
      commit('DELETE_ALL', { serverId, appId, })
    },    
  },
  getters: {
    servers: function (state) {
      return state.servers
    },
    enigmaInstance: function (state) {
      return state.enigmaInstance
    },
    getNotes: function (state) {
      return state.notes
    },
    section: function (state) {
      return state.sectionText
    }
  }
})
