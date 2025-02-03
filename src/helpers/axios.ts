import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export {instance as axios};