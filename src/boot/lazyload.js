import VueLazyload from "vue-lazyload";
import loadingImage from "src/assets/loader.gif";
import errorImage from "src/assets/error.png";
import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
	app.use(VueLazyload, {
		preLoad: 1.3,
		error: errorImage,
		loading: loadingImage,
		attempt: 1,
	});
});
