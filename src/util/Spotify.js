const clientID='b0d68b7c1cfa45d7b1f2576db3e82aef';
const redirectURI="http://localhost:3000";
let accessToken='';

const Spotify = {
	
		getAccessToken() {
        if(accessToken) {
            return accessToken;
        } 
        
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

         if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = authURL;
        }
    },
	
		search: async function (term) {
				this.getAccessToken();
				let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
			try {
				let response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				
				
			});
			if (response.ok) {
                let jsonResponse = await response.json();
				let tracks = jsonResponse.tracks.items.map(track => {
                    return {
                        ID: track.id,
                        artist: track.artists[0].name, Name: track.name, Album: track.album.name, URI: track.uri
                    }
                })
                return tracks;
            }
            throw new Error('Error on retrieving data from Spotify API');
        } catch (error) {
            console.log(error);
        }

    },
    savePlayList: async function (name, tracks) {
        this.getAccessToken();
        if (!tracks || name === undefined) {
            return
        }

        try {
          
            let headers = { 'Authorization': 'Bearer ' + accessToken };
            let urlUserInfo = 'https://api.spotify.com/v1/me';
            let response = await fetch(urlUserInfo, { headers: headers });

            if (!response.ok) {
                throw new Error('Fail to get user info');
            }

            let userInfo = await response.json();

         
            headers = { ...headers, 'Content-Type': 'application/json' }
            const urlPlaylist = `https://api.spotify.com/v1/users/${userInfo.id}/playlists`;

            response = await fetch(
                urlPlaylist,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ name: name })
                }
            );

            if (!response.ok) {
                throw new Error('Fail to create playlist');
            }

            let playlistInfo = await response.json();
            let playlistId = playlistInfo.id;
            const urlPlaylistTracks = `https://api.spotify.com/v1/users/${userInfo.id}/playlists/${playlistId}/tracks`;
            response = await fetch(
                urlPlaylistTracks,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: tracks })
                });
            if (!response.ok) {
                throw new Error('Fail to add tracks to playlist');
            }
        } catch (error) {
            console.log(error);
        }

    }

		
	

	
}
export default Spotify;
