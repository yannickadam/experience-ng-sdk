import getNestedObject from '../utils/get-nested-object';

export function addPageMetaData(configuration: any, preview: boolean): void {
  if (preview) {
    // add new body comments
    const pageMetaData: string = getNestedObject(configuration, ['page', '_meta', 'endNodeSpan', 0]);
    if (pageMetaData) {
      // remove comments from page meta-data element, if existing
      let pageMetaDataElm: HTMLElement = document.getElementById('hst-page-meta-data');
      if (pageMetaDataElm) {
        pageMetaDataElm.innerHTML = '';
      } else {
        // otherwise create page-meta-data element containing page HTML comments
        pageMetaDataElm = document.createElement('div');
        pageMetaDataElm.id = 'hst-page-meta-data';
        pageMetaDataElm.style.display = 'none;';
        document.body.appendChild(pageMetaDataElm);
      }

      for (let i = 0; i < configuration.page._meta.endNodeSpan.length; i++) {
        pageMetaDataElm.insertAdjacentHTML('beforeend', configuration.page._meta.endNodeSpan[i].data);
      }
    } else {
      console.error('BRE SDK: Failed to find Page Meta Data');
    }
  }
}

export function addComponentMetaData(preview: boolean, element: HTMLElement, configuration: any): void {
  if (preview) {
    const beginNodeSpan: string = getNestedObject(configuration, ['_meta', 'beginNodeSpan', 0, 'data']);
    addComment(element, 'beforebegin', beginNodeSpan, 'cms-begin-comment-added');
    const endNodeSpan: string = getNestedObject(configuration, ['_meta', 'endNodeSpan', 0, 'data']);
    addComment(element, 'afterend', endNodeSpan, 'cms-end-comment-added');
  }
}

export function addContainerMetaData(preview: boolean, element: HTMLElement, configuration: any): void {
  if (preview) {
    const beginNodeSpan: string = getNestedObject(configuration, ['_meta', 'beginNodeSpan', 0, 'data']);
    addComment(element, 'afterbegin', beginNodeSpan, 'cms-begin-comment-added');
    const endNodeSpan: string = getNestedObject(configuration, ['_meta', 'endNodeSpan', 0, 'data']);
    addComment(element, 'beforeend', endNodeSpan, 'cms-end-comment-added');
  }
}

export function addEditButtonMetaData(preview, element, metaData): void {
  if (preview) {
    const nodeSpan = getNestedObject(metaData, ['_meta', 'beginNodeSpan', 0, 'data']);
    addComment(element, 'afterbegin', nodeSpan, 'cms-begin-comment-added');
  }
}

function addComment(element: HTMLElement, position: InsertPosition, comment: string, className: string): void {
  if (element && comment && !element.classList.contains(className)) {
    try {
      element.insertAdjacentHTML(position, `${comment}`);
      element.classList.add(className);
    } catch (e) {
      console.log(`Error creating HTML comment: ${e}, for data: ${comment}`);
    }
  } else {
    console.log(`Error in addComment. element: ${element}, comment: ${comment}`);
  }
}
