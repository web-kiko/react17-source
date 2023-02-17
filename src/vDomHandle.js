//@1.1创建虚拟dom
export  function createElement(ele,props,...children) {
    let vDom={
        $$typeof:Symbol('react.element'),
        key:null,
        ref:null,
        props:{},
        type:null
    };

    //@1.2处理数据
    let len =children.length;
    
    vDom.type=ele,
    if(props!==null){
        vDom.props={
            ...props
        }
    };
    if(len===1){
        vDom.props.children=children[0];
    }
    if(len>1){
        vDom.props.children=children;
    }


    return vDom ;
}