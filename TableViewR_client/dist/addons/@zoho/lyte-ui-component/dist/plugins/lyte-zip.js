/**
 * This is for creating basic zip file in client. 
 * This doesn't contains all the features of the zipping process.
 * contact @lyte-team@zohocorp.com
 */

/**
 * https://www.iana.org/assignments/media-types/application/zip
 * https://stackoverflow.com/questions/8608724/how-to-zip-files-using-javascript
 */

;( function(){
    var local_file_header_signature = 0x4034b50,
    central_directory_header_signature = 0x02014b50,
    end_of_central_directory_signature = 0x06054b50,
    bin2bytehex = ( value, byte ) =>{
        var __bit = byte * 8;
        value = value.padStart( __bit, '0' ),
        __split = value.match( /.{8}/g );

        return __split.map( item =>{
            return parseInt( item, 2 ).toString( 16 ).padStart( 2, 0 );
        } ).reverse().join( " " );
    },
    irreducible_poly = parseInt( "3mrh0p0", 32 ),
    log_arr = ( () => {
        var __limit = 0xFF,
        n,
        arr = [];

        for( var i = 0; i <= __limit; i++ ){
            n = i;
            for( var j = 0; j < 8; j++ ){
                n = 1 & n ? irreducible_poly ^ n >>> 1 : n >>> 1;
            }

            arr.push( n );
        }

        return arr;
    } )(),
    correction = function( str ){
        var index = -1,
        __len = str.length;
        
        for( var i = 0; i < __len; i++ ){
            index = index >>> 8 ^ log_arr[ 0xFF & ( index ^ str[ i ] ) ];
        }

        return bin2bytehex( ( ( -1 ^ index ) >>> 0 ).toString( 2 ), 4 );
    },
    to_binary = function( dec, size ){
        return dec.toString( 2 ).padStart( size || 0, 0 );
    },
    text2dec = function( str ){
        return new TextEncoder().encode( str );
    },
    dec2hex = function( arr ){
        return Array.from( arr ).map( item => item.toString( 16 ).padStart( 2, 0 ) ); 
    },
    convert_to_buff = function( str ){
        return new Uint8Array( str.split( " " ).map( item => parseInt( item, 16 ) ) );
    },
    get_recursive_folder = function( folder ){
        var __parent = folder.parent;

        if( __parent ){
            var __ret = get_recursive_folder( __parent );
            return `${ __ret ? `${ __ret }/` : "" }` + folder.name;
        }
        return "";
    }

    class LyteFile{
        constructor( file_obj ){
            this.file = {
                fileObject : file_obj,
            };
            return this;
        }

        async init( folder_name = "", parent ){
            var __file = this.file,
            file_obj = __file.fileObject,
            ret = await file_obj.arrayBuffer(),
            __name = file_obj.webkitRelativePath || file_obj.name,
            rec_folder = get_recursive_folder( parent );

            if( rec_folder ){
                if( folder_name ){
                    folder_name = `${ folder_name }/${ rec_folder }`;
                } else {
                    folder_name = rec_folder;
                }
            }

            __file.size = file_obj.size;
            __file.name = __name;
            __file.modified = new Date( file_obj.lastModified );
            __file.path = `${ folder_name ? `${folder_name}/` : "" }${ __name }`;
            __file.buffer = new Uint8Array( ret );
        }

        get_mod_date(){
            var date = this.file.modified,
            year = to_binary( date.getFullYear() - 1980, 7 ),
            month = to_binary( date.getMonth() + 1, 4 ),
            day = to_binary( date.getDate(), 5 );
            
            return `${ bin2bytehex( `${year}${month}${day}`, 2 )}`
        }

        get_mod_time(){
            var date = this.file.modified,
            hours = to_binary( date.getHours(), 5 ),
            minutes = to_binary( date.getMinutes(), 6 ),
            seconds = to_binary( date.getSeconds(), 5 );
            
            return `${ bin2bytehex( `${hours}${minutes}${seconds}`, 2 )}`
        }

        do_encode( directoryInit ){
            var local_header,
            central_header,
            __file = this.file,
            buffer = __file.buffer,
            path = __file.path,
            signature = bin2bytehex( to_binary( local_file_header_signature ), 4 ),
            version_needed = bin2bytehex( to_binary( 20 ), 2 ),
            general_purpose_bit = bin2bytehex( to_binary( 0 ), 2 ),
            compression_method = bin2bytehex( to_binary( 0 ), 2 ),
            mod_time = this.get_mod_time(),
            mod_date = this.get_mod_date(),
            correction_value = correction( buffer ),
            comp_uncomp_size = bin2bytehex( buffer.length.toString( 2 ), 4 ),
            extra_field_length = bin2bytehex( to_binary( 0 ), 2 ),
            encoded_name = text2dec( path ),
            name_file = dec2hex( encoded_name ).join( " " ),
            file_path_length = bin2bytehex( encoded_name.length.toString( 2 ) , 2 ),
            local_header_buffer,
            file_comment_length = bin2bytehex( to_binary( 0 ), 2 ),
            disk_number_start = bin2bytehex( to_binary( 0 ), 2 ),
            internal_file_attr = bin2bytehex( to_binary( 1 ), 2 ),
            external_file_attr = bin2bytehex( to_binary( 32 ), 4 ),
            relative_offset = bin2bytehex( to_binary( directoryInit ), 4 );

            local_header = `${ signature } ${ version_needed } ${ general_purpose_bit } ${ compression_method } ${ mod_time } ${mod_date} ${ correction_value } ${ comp_uncomp_size } ${ comp_uncomp_size } ${ file_path_length } ${ extra_field_length } ${ name_file }`;
            local_header_buffer = convert_to_buff( local_header );

            directoryInit += ( local_header_buffer.length + buffer.length );

            central_header = `${ bin2bytehex( to_binary( central_directory_header_signature ), 4 ) } ${ version_needed } ${ version_needed } ${ general_purpose_bit } ${ compression_method } ${ mod_time } ${ mod_date } ${ correction_value } ${ comp_uncomp_size } ${ comp_uncomp_size } ${ file_path_length } ${ extra_field_length } ${ file_comment_length } ${ disk_number_start } ${ internal_file_attr } ${ external_file_attr } ${ relative_offset } ${ name_file }`;

            return {
                directoryInit : directoryInit,
                centralDirectoryFileHeader : central_header,
                arr : [
                    local_header_buffer,
                    buffer
                ]
            }
        }
    };

    class LyteZip{
        constructor( options ){
            this.options = options || {};
            this.files = [];
            this.folders = {};
        }

        blob_type = "application/octet-stream";

        folder( name ){
            var folders = this.folders,
            __folder = new LyteFolder( name, this );
            folders[ name ] = __folder;
            return __folder;
        }

        removeFolder( name ){
            return delete this.folders[ name ];
        }

        getFolder( name ){
            return this.folders[ name ];
        }

        generateZip(){

            this.created = true;

             var files = this.getFiles(),
             directoryInit = 0,
             centralDirectoryFileHeader = "",
             entries = files.length,
             arr = [],
             fn = () => {
                let args = Array.from( arguments ),
                ns = args.shift(),
                cb = this.options[ ns ];

                args.unshift( this );

                return cb && cb.apply( this, args );
             };

             if( !entries ){
                fn( "onError" );
                return;
             }

             try{
                files.forEach( ( item, index ) =>{
                    var ret = item.do_encode( directoryInit );
                    directoryInit = ret.directoryInit;
                    centralDirectoryFileHeader += `${ index ? "" : " " }${ret.centralDirectoryFileHeader}`; 
                    arr.push.apply( arr, ret.arr );
                });

                var signature = bin2bytehex( to_binary( end_of_central_directory_signature ), 4 ),
                number_of_this_disk = bin2bytehex( to_binary( 0 ), 2 ),
                number_of_disk_start_of_central_directory = bin2bytehex( to_binary( 0 ), 2 ),
                entires_in_central_disk =  bin2bytehex( to_binary( entries ), 2 ),
                entries_in_central_directory = bin2bytehex( to_binary( entries ), 2 ),
                size_of_central_directory =  bin2bytehex( to_binary( centralDirectoryFileHeader.split( /\s/ ).length ), 4 ),
                offset_of_start_of_central_directory = bin2bytehex( to_binary( directoryInit ), 4 ),
                end_of_central_directory = `${ signature } ${ number_of_this_disk } ${ number_of_disk_start_of_central_directory } ${ entires_in_central_disk } ${ entries_in_central_directory } ${ size_of_central_directory } ${ offset_of_start_of_central_directory }`;

                arr.push( convert_to_buff( centralDirectoryFileHeader ), convert_to_buff( end_of_central_directory ) );

                var __ret = fn( 'onSuccess', arr, files, centralDirectoryFileHeader, end_of_central_directory );

                if( __ret != void 0 ){
                    arr = __ret;
                } else if( __ret == false ){
                    return fn( "onError" );
                }
                return this.blob = new Blob( arr, { type : this.blob_type } );
            } catch( err ){
                fn( "onError", err );
            }
        }

        downloadZip(){

            if( !this.isValid() ){
                if( this.created ){
                    return false;
                } else {
                    this.generateZip();
                    if( !this.isValid() ){
                        return false;
                    }
                }
            }

            var a = document.createElement( 'a' ),
            name = this.options.name || "download";

            if( !/\.zip$/i.test( name ) ){
                name += ".zip";
            }

            a.href = URL.createObjectURL( this.blob );
            a.download = name;
            a.click();
            return true;
        }
        
        async insertFile( file_obj, file_options = {}, __index ){

            if( typeof file_options == "string" ){
                file_options = { fileName : file_options };
            }

            var files = this.files,
            un_supported = this.options.unSupportedFormats || [];
            
            __index = __index || files.length,

            // Zip file addition is not supported as of now. Need a fully functioning unzip plugin to support this
            un_supported.push( "application/zip" );

            if( un_supported.indexOf( file_obj.type ) + 1 ){
                return await false;
            }

            var ret = new LyteFile( file_obj ),
            overall_folder = this.options.folderName,
            current_folder = file_options.folderName,
            final_folder = `${ current_folder ? overall_folder ? `${ overall_folder } / ${ current_folder }` : current_folder : ( overall_folder || "" ) }`;
            
            await ret.init( final_folder, this );

            files.splice( __index, 0, ret );
            return file_obj;
        }

        removeFile( name ){
            var files = this.files,
            __index = files.findIndex( item =>{
                return name == item.file.name;
            } );

            if( name && __index + 1 ){
                files.splice( __index, 1 );
                return true;
            } else if( files.length ){
                files.splice( 0, files.length );
                return true;
            }
            return false;
        }

        getFiles(){
            var __files = this.files,
            folders = this.folders,
            ret = [];

            for( var key in folders ){
                var __folder = folders[ key ];
                ret.push.apply( ret, __folder.getFiles() );
            }

            ret.push.apply( ret, __files ) ;
            return ret;
        }

        isValid(){
            return !!this.blob;
        }

        addFiles( files, file_options = {} ){
            var __len = files.length,
            prom_arr = [];

            for( var i = 0; i < __len; i++ ){
                prom_arr.push( this.insertFile( files[ i ], file_options ) ); 
            }
            return Promise.all( prom_arr );
        }

        async addFileByText( text, file_options = {} ){

            if( typeof file_options == "string" ){
                file_options = { fileName : file_options };
            }

            try {
                var buffer = text2dec( text ),
                blob = new Blob( [ buffer ], { type : this.type } ),
                last_modified = file_options.lastModified || Date.now(),
                file_constructor_options = { 
                    type : file_options.contentType, 
                    lastModified : last_modified
                },
                file = new File( [ blob ], file_options.fileName || "sample.txt", file_constructor_options );

                file_options.folderName = file_options.folderName || "";
                return await this.insertFile( file, file_options );
            }catch( err ){
                return await err;
            }
        }

        /**
         * Folder fetching is not handled here.
         */
        async addFileByPath( path, file_options = {}, options = {} ){
            if( typeof file_options == "string" ){
                file_options = { fileName : file_options };
            }
            try{
                var res = await fetch( path, options );

                if( !res.ok ){
                     throw new Error( res.statusText );
                }

                var buffer = await res.arrayBuffer(),
                blob = new Blob( [ buffer ], { type : this.type } ),
                res_header = res.headers,
                content_type = res_header.get( "Content-Type" ),
                last_modified = res_header.get( "Last-Modified" ) || Date.now(),
                __path = ( () => {
                    var mod_path = path.replace( /^\.\//, "" ).replace( /^\//, "" ),
                    split = mod_path.split( "/" );
        
                    return {
                        fileName : split.pop(),
                        folderName : split.join( "/" )
                    };
                } )(),
                file_constructor_options = { 
                    type : file_options.contentType || content_type, 
                    lastModified : last_modified
                },
                file = new File( [ blob ], file_options.fileName || __path.fileName, file_constructor_options );

                file_options.folderName = file_options.folderName || __path.folderName;
                
                return await this.insertFile( file, file_options );
            } catch( err ){
                return await err;
            }
        }
    };

    class LyteFolder extends LyteZip{
        constructor( name, parent ){
            super();
            var split = name.split( "/" ),
            __name = split.shift();
            this.name = __name;
            this.parent = parent;

            if( split.length ){
                return new LyteFolder( split.join( "/" ), this );
            }
            return this;
        }
    }

    if( typeof $L != "undefined" ){
        $L.LyteZip = LyteZip;
    } else {
        window.LyteZip = LyteZip;
    }
})();