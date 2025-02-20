
const initSlides = (asset, upSlides, reUpSlides, sound)=> {
	const slides = document.querySelectorAll('.slide');
	const stepInfo = document.querySelector('#stepInfo');
	const titleInfo = document.querySelector('#titleInfo');
	const nextBtn = document.querySelector('#next');

	let totalSteps = 0;

	let i, j, t = 0;
	for (i=0; i<slides.length; i++){
		t = slides[i].children ? slides[i].children.length : 0;
		totalSteps += t/2;
		
		for (j=0; j<t; j++)
			if(t>0) slides[i].children[j].style.display = 'none';
	}

	//-----------------------------------------------------------

	slides[0].style.zIndex = '2';
	stepInfo.textContent = '0 / ' + totalSteps;
	stepInfo.style.display = 'none';
	nextBtn.style.display = 'none';
	//-----------------------------------------------------------
	let currentIndex = 0; //index of currentslide
	let curSubIndex = 0;  //index of current subelement of current slide 
	let curStep = 0;

	let curChildren;
	let	totalChildren;
	let first = 1;
	//------------------------------
	const nextClick = () => {
		
		if(first){
			for(let item of slides){
				item.style.display = 'flex';
			}
			first = 0;
		}
		
		curStep++;
		stepInfo.textContent = curStep + ' / ' + totalSteps;
		sound.stop();
		sound.play('step' + curStep);
		switch (curStep){
			case 1:
				stepInfo.style.display = 'flex';
				nextBtn.textContent = '下一步';
				
				curChildren = slides[0].children;
				totalChildren = curChildren ? curChildren.length : 0;//must be even, to do

				break;
				
			case totalSteps:
				nextBtn.textContent = '演示结束 / 返回';
				break;
				
			case totalSteps + 1:

				if(curChildren){
					curChildren[totalChildren - 2].style.display = 'none';
					for(i=1; i<totalChildren; i+=2)
						curChildren[i].style.display = 'none';
				}
			
				currentIndex = 0; 
				curSubIndex = 0;
				curStep = 0;
				
				slides[slides.length - 2].style.zIndex = '0';
				slides[slides.length - 1].style.zIndex = '0';
				slides[0].style.zIndex = '2';
				
				stepInfo.style.display = 'none';
				nextBtn.textContent = '开始演示';

				return;
			
		}
		
		for(i=0; i<upSlides.length; i++){
			if(curStep === upSlides[i]){
				slides[i].classList.add('up' + i);
				break;
			}
		}

		for(i=0; i<reUpSlides.length; i++){
			if(curStep === reUpSlides[i]){
				slides[i].classList.remove('up' + i);
				break;
			}
		}
		
		if(curSubIndex < totalChildren){
			curChildren[curSubIndex].style.display = 'flex';
			curChildren[curSubIndex + 1].style.display = 'flex';
			
			if(curSubIndex > 0){ 
				curChildren[curSubIndex - 2].style.display = 'none'; 
			}
			
			curSubIndex += 2;
			return;
		}
		
		if(curSubIndex === totalChildren){
			
			curSubIndex	= 0;
			if(curChildren){
				curChildren[totalChildren - 2].style.display = 'none';
				for(i=1; i<totalChildren; i+=2)
					curChildren[i].style.display = 'none';
			}
			
			if( currentIndex < slides.length - 1){
				curChildren = slides[currentIndex + 1].children;
				totalChildren = curChildren ? curChildren.length : 0;
				if(curChildren){
					curChildren[0].style.display = 'flex';
					curChildren[1].style.display = 'flex';
					curSubIndex	= 2;
				}
			}
			
			//--------------------------------------------------------------------
			t = (currentIndex - 1 + slides.length) % slides.length;
			slides[t].style.zIndex = '0';
			
			slides[currentIndex].classList.remove('star');
			slides[currentIndex].style.zIndex = '1';
			
			currentIndex = (currentIndex + 1) % slides.length;
			slides[currentIndex].style.zIndex = '2';
			slides[currentIndex].classList.add('star');

		}			
	};
	

	sound.on('load', () => {
		nextBtn.addEventListener('click', nextClick);
		document.addEventListener('keydown', (e) => {
			if( e.keyCode === 0x20){
				nextClick();
				e.preventDefault();
			}
		});
		nextBtn.style.display = 'flex';
	});

	for(let i=0; i<asset.length; i++){
		slides[i].style.backgroundImage = 'url(' + asset[i] + ')';
		//slides[i].style.display = 'flex';
	}
	slides[0].style.display = 'flex';
}

const initLoadingBar = ()=> {
	const ctx = canvas.getContext('2d');
	canvas.height = window.innerHeight;
	canvas.width = window.innerHeight * 0.46;
	//ctx.fillStyle="#a0a0a0";
	//ctx.fillRect(0,0,canvas.width,canvas.height);
	
	let x1 = canvas.width / 10;
	let y1 = canvas.height / 2 - 10;
	
	let x2 = canvas.width * 0.9;
	let y2 = canvas.height / 2 + 10;
	
	ctx.strokeStyle = "#333646";
	ctx.lineWidth = 2;
	ctx.fillStyle = "#F5A343";
	
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

const checkLoadComplete = (asset, upSlides, reUpSlides, sound)=> {
	initSlides(asset, upSlides, reUpSlides, sound);
	loading.style.display = 'none';
}

function loadAssets(asset, upSlides, reUpSlides, sound) {
	initLoadingBar();
	let x1 = canvas.width / 10;
	let y1 = canvas.height / 2 - 10;
	
	let assetsLoaded = 0;
	let totalAssets = asset.length;
	let ctx = canvas.getContext('2d');
	for(let item of asset){
		let c = new Image;
		c.onload = function(){
			assetsLoaded++;
			
			ctx.fillRect(x1 + 2, y1 + 2, (canvas.width * 0.8 - 4) / totalAssets * assetsLoaded, 16);
			if(assetsLoaded === totalAssets)
				checkLoadComplete(asset, upSlides, reUpSlides, sound);
		}
		c.src = item; 
	}
}


