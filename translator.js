/**
 * Fetch i18n file, store, find translation
 */
class Translator {

    /**
     * @param {Object} options 
     * @param {string} [options.lang] 
     */
    constructor(options = {}) {
        if (options.lang) {
            this.setLangCode(options.lang);
        } else {
            const localLang = this.getLocalLanguage();

            this.setLangCode(localLang);
        }
    }
    
    /**
     * @public
     */
    async init() {
        await this.fetchLangFile(this.getLangCode());
    }
    
    /**
     * @public
     * @param {String} langCode 
     */
    async setLang(langCode) {
        this.setLangCode(langCode);

        await this.fetchLangFile(langCode);
    }

    /**
     * @public
     * @param {String} key 
     * @returns 
     */
    getTranslation(key) {
        const dict = this.getDictionary();
        const res = dict[key];

        if (!res) {
            console.error(`Missing translation for ${key} (${this.getLangCode()})`);
        }

        return res;
    }

    /**
     * @protected
     * @returns {String}
     */
    getLocalLanguage() {
        const navigator = this.getNavigator();
        
        return navigator.languages ? navigator.languages[0] : navigator.language;
    }
    
    /**
     * @protected
     * @param {String} langCode 
     */
    async fetchLangFile(langCode) {
        await fetch(`/i18n/${langCode}.json`)
            .then(data => {
                console.log('data', data);
                return data.json();
            })
            .then(dict => {
                this.setDictionary(dict);
            })
            .catch(() => {
                console.error(`Missing translation ${this.langCode}.json.`);
            });
    }

    /**
     * @protected
     * @param {String} langCode 
     */
    setLangCode(langCode) {
        this.langCode = langCode.substr(0, 2);
    }

    /**
     * @protected
     * @returns {String}
     */
    getLangCode() {
        return this.langCode;
    }

    /**
     * @protected
     * @param {Object} langDict 
     */
    setDictionary(langDict) {
        this.translations = langDict;
    }

    /**
     * @protected
     * @returns {Object}
     */
    getDictionary() {
        return this.translations || null;
    }
    
    /**
     * @private
     * @returns {Navigator}
     */
    getNavigator() {
        return window.navigator;
    }
}
export default Translator;