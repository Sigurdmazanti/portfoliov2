export function removeItemFromArray(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

export function throttleDebounce(func, wait) {
    let lastFunc;
    let lastRan;

    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastRan), 0));
        }
    };
}

export function arrayBufferToBase64(buffer) {
    const CHUNK_SIZE = 8192;
    let result = '';
    const uintArray = new Uint8Array(buffer);

    for (let i = 0; i < uintArray.length; i += CHUNK_SIZE) {
        const chunk = uintArray.subarray(i, i + CHUNK_SIZE);
        result += String.fromCharCode.apply(null, chunk);
    }

    return btoa(result);
}

export function base64ToArrayBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
}

export function isFloat(value) {
    return parseInt(value) !== value;
}

export function vh(percent) {
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
  
export function vw(percent) {
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}

export function disableLink(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

export function waitForNextNamespace(data) {
    return new Promise((resolve) => {
        const checkNamespace = () => {
            if (data.next && data.next.namespace !== undefined) {
                resolve(data.next.namespace);
            } else {
                setTimeout(checkNamespace, 100);
            }
        };
        checkNamespace();
    });
}

export function trackDirection(value) {
    typeof value !== "object" && (value = { onUpdate: value });
    let prevTime = 0,
      prevReversed = false,
      anim = value.eventCallback ? value : value.animation,
      onUpdate = value.onUpdate,
      onToggle = value.onToggle;
    return anim
      ? anim.eventCallback(
          "onUpdate",
          trackDirection({ onUpdate: onUpdate, onToggle: onToggle })
        )
      : function () {
          let time = this.totalTime(),
            reversed = time < prevTime;
          this.direction = reversed ? -1 : 1;
          if (reversed !== prevReversed) {
            onToggle && onToggle.call(this, this.direction);
            prevReversed = reversed;
          }
          prevTime = time;
          onUpdate && onUpdate.call(this, this.direction);
        };
}