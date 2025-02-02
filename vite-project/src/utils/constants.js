export const HOST = "https://sphenoid-azure-oviraptor.glitch.me/"

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMG = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMG = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS = `${CONTACTS_ROUTES}/get-contacts`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MSGS = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_MSGS = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNELS_ROUTES = "api/channels";
export const CREATE_CHANNEL = `${CHANNELS_ROUTES}/create-channel`;
export const GET_ALL_CHANNELS = `${CHANNELS_ROUTES}/get-channel`;
export const GET_CHANNEL_MSGS = `${CHANNELS_ROUTES}/get-channel-messages`;
