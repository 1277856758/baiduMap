const state = {
    layers: [],
    highlightLayer: null,
    mapv: {}
};

const getters = {
    fullscreenLoading: state => state.fullscreenLoading,
    updateFullscreenLoadingMessage (state, Loading) {
        state.fullscreenLoadingMessage = Loading;
    }
};

const mutations = {
    updateFullscreenLoading (state, Loading) {
        state.fullscreenLoading = Loading;
    },
    updateFullscreenLoadingMessage (state, Loading) {
        state.fullscreenLoadingMessage = Loading;
    },
    setLayers (state, data) {
        state.layers = data;
    },
    setHighlightLayer (state, obj) {
        state.highlightLayer = obj;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};
