import Vue from 'vue'
import Vuex from 'vuex'
import enigma from 'enigma.js'
// import WebSocket from 'ws'
import schema from 'enigma.js/schemas/12.20.0.json'
import uuid from 'uuid/v4'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    notes: [],
    enigmaInstance: {
      global: {},
      app: {},
      session: {}
    },
    sectionText: ''
  },
  mutations: {
    INIT_STORE: function (state) {
      if (localStorage.getItem('servers')) {
        state.servers = JSON.parse(localStorage.getItem('servers'))
      }

      if (localStorage.getItem('notes')) {
        state.notes = JSON.parse(localStorage.getItem('notes'))
      }

    },
    SET_ENIGMA_INSTANCE: function (state, { global, session }) {
      state.enigmaInstance.global = global
      state.enigmaInstance.session = session
    },
    ADD_NOTE: function (state, n) {
      state.notes.push(n)

      localStorage.setItem('notes', JSON.stringify(state.notes))
    },
    REMOVE_NOTE: function (state, id) {
      state.notes = state.notes.filter(function (n) {
        return n.id != id
      })

      localStorage.setItem('notes', JSON.stringify(state.notes))
    },
    REMOVE_ALL_NOTES: function (state, { serverId, appId }) {
      state.notes = state.notes.filter(function (n) {
        return (n.serverId != serverId && n.appId != appId)
      })

      localStorage.setItem('notes', JSON.stringify(state.notes))
    },
    UPDATE_NOTE: function (state, n) {
      for (let note in state.notes) {
        if (n.id == note.id) {
          note = n
        }
      }

      localStorage.setItem('notes', JSON.stringify(state.notes))
    },
    ADD_SERVER: function (state) {
      state.servers.push({
        id: uuid(),
        name: '',
        host: '',
        port: ''
      })

      localStorage.setItem('servers', JSON.stringify(state.servers))
    },
    DELETE_SERVER: function (state, server) {
      state.servers = state.servers.filter(function (s) {
        return s.id != server.id
      })

      localStorage.setItem('servers', JSON.stringify(state.servers))

      state.notes = state.notes.filter(function (n) {
        return n.serverId != server.id
      })

      localStorage.setItem('notes', JSON.stringify(state.notes))

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

      localStorage.setItem('servers', JSON.stringify(state.servers))
    },
    COLLAPSE_ALL: function (state, { serverId, appId, expanded }) {
      for (let n of state.notes) {
        if (n.serverId == serverId && n.appId == appId) {
          n.expanded = expanded
        }
      }

      localStorage.setItem('notes', JSON.stringify(state.notes))
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
        console.log(docs)
        commit('SET_ENIGMA_INSTANCE', { global: global, session: session })
        return docs
      } catch (e) {
        // console.log(e)
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
