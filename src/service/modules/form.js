import { POST } from '../http';

export function submitWebform(formId, formValue) {
	const data = {
		webform_id: formId,
		images: ['36'], // for test
		...formValue,
	};
	return POST(`/webform_rest/submit`, {
		data: data,
	});
}
