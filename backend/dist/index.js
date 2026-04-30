"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgendas = exports.komunitasApi = exports.getCommunities = exports.kegiatanApi = exports.getEvents = exports.paymentsApi = exports.residentsApi = exports.housesApi = exports.getStats = exports.getResume = exports.getPosts = exports.getProducts = exports.getOrganizations = exports.getActivities = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3001/api';
const api = axios_1.default.create({
    baseURL: API_URL,
});
const getActivities = () => api.get('/activities').then(res => res.data);
exports.getActivities = getActivities;
const getOrganizations = () => api.get('/organizations').then(res => res.data);
exports.getOrganizations = getOrganizations;
const getProducts = () => api.get('/products').then(res => res.data); // ✅ tambahan
exports.getProducts = getProducts;
const getPosts = () => api.get('/posts').then(res => res.data); // ✅ tambahan
exports.getPosts = getPosts;
const getResume = () => api.get('/resume').then(res => res.data);
exports.getResume = getResume;
const getStats = () => api.get('/stats').then(res => res.data);
exports.getStats = getStats;
exports.housesApi = {
    getAll: () => api.get('/houses').then(res => res.data),
    create: (data) => api.post('/houses', data).then(res => res.data),
    update: (id, data) => api.put(`/houses/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/houses/${id}`).then(res => res.data),
};
exports.residentsApi = {
    getAll: () => api.get('/residents').then(res => res.data),
    create: (data) => api.post('/residents', data).then(res => res.data),
    update: (id, data) => api.put(`/residents/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/residents/${id}`).then(res => res.data),
};
exports.paymentsApi = {
    getAll: (month, year) => api.get('/payments', { params: { month, year } }).then(res => res.data),
    generate: (month, year) => api.post('/payments/generate', { month, year }).then(res => res.data),
    pay: (id, data) => api.put(`/payments/${id}/pay`, data).then(res => res.data),
};
const getEvents = () => api.get('/kegiatan').then(res => res.data);
exports.getEvents = getEvents;
exports.kegiatanApi = {
    getAll: () => api.get('/kegiatan').then(res => res.data),
    create: (data) => api.post('/kegiatan', data).then(res => res.data),
    delete: (id) => api.delete(`/kegiatan/${id}`).then(res => res.data),
};
const getCommunities = () => api.get('/komunitas').then(res => res.data);
exports.getCommunities = getCommunities;
exports.komunitasApi = {
    getAll: () => api.get('/komunitas').then(res => res.data),
    create: (data) => api.post('/komunitas', data).then(res => res.data),
    delete: (id) => api.delete(`/komunitas/${id}`).then(res => res.data),
};
const getAgendas = (params) => api.get('/agendas', { params }).then(res => res.data);
exports.getAgendas = getAgendas;
exports.default = api;
